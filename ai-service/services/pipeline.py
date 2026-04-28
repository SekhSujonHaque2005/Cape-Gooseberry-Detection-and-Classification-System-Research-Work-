import cv2
import logging
from concurrent.futures import ThreadPoolExecutor

from services.detect import Detector
from services.classify import Classifier
from services.yield_estimator import YieldEstimator
from services.architecture import ArchitectureAnalyzer
from services.vlm_analyzer import VLMAnalyzer

logger = logging.getLogger(__name__)


class Pipeline:
    def __init__(self, detection_model_path, classification_model_path, hf_token=None):
        self.detector = Detector(detection_model_path)
        self.classifier = Classifier(classification_model_path)
        self.yield_estimator = YieldEstimator()
        self.architecture_analyzer = ArchitectureAnalyzer()
        self.vlm_analyzer = VLMAnalyzer(hf_token)

    def _run_yolo_pipeline(self, image_rgb, growth_retardant, training_system):
        """Run the traditional YOLO + EfficientNet pipeline."""
        try:
            detections = self.detector.detect(image_rgb)

            results = []
            for det in detections:
                x1, y1, x2, y2 = det["bbox"]
                crop = image_rgb[y1:y2, x1:x2]

                if crop.size == 0:
                    continue

                label = self.classifier.predict(crop)
                det["label"] = label
                results.append(det)

            total = len(results)
            ripe = sum(1 for r in results if r["label"] == "ripe")
            semi = sum(1 for r in results if r["label"] == "semi_ripe")
            unripe = sum(1 for r in results if r["label"] == "unripe")

            estimated_yield = self.yield_estimator.estimate(
                results,
                growth_retardant=growth_retardant,
                training_system=training_system
            )

            return {
                "total_fruits": total,
                "ripe": ripe,
                "semi_ripe": semi,
                "unripe": unripe,
                "estimated_yield_kg": estimated_yield,
                "detections": results,
            }
        except Exception as e:
            logger.error(f"YOLO pipeline failed: {e}")
            return {
                "total_fruits": 0,
                "ripe": 0,
                "semi_ripe": 0,
                "unripe": 0,
                "estimated_yield_kg": 0,
                "detections": [],
            }

    def _run_vlm(self, image_path):
        """Run the VLM analysis."""
        return self.vlm_analyzer.analyze(image_path)

    def process(self, image_path, growth_retardant="none", training_system="standard"):
        image = cv2.imread(image_path)

        if image is None:
            raise ValueError("Image not found or invalid format")

        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Run YOLO pipeline and VLM in PARALLEL
        with ThreadPoolExecutor(max_workers=2) as executor:
            yolo_future = executor.submit(
                self._run_yolo_pipeline, image_rgb, growth_retardant, training_system
            )
            vlm_future = executor.submit(self._run_vlm, image_path)

            yolo_result = yolo_future.result()
            vlm_result = vlm_future.result()

        # Architecture analysis (fast, always runs)
        architecture = self.architecture_analyzer.analyze(image_rgb)

        # --- SMART MERGE LOGIC ---
        vlm_count = vlm_result.get("fruit_count", 0) if vlm_result else 0
        yolo_count = yolo_result["total_fruits"]
        
        # Use VLM as primary if it detected significantly more fruits (>30% more)
        # or if YOLO failed entirely. This compensates for YOLO missing husks in dense foliage.
        use_vlm_primary = (vlm_count > yolo_count * 1.3) or (yolo_count == 0)

        if not use_vlm_primary:
            # YOLO is authoritative — use its precise bounding box data
            final = {
                "total_fruits": yolo_result["total_fruits"],
                "ripe": yolo_result["ripe"],
                "semi_ripe": yolo_result["semi_ripe"],
                "unripe": yolo_result["unripe"],
                "estimated_yield_kg": yolo_result["estimated_yield_kg"],
                "architecture": architecture,
                "detections": yolo_result["detections"],
                "analysis_source": "yolo_primary",
            }
        elif vlm_count > 0:
            # YOLO under-counted — use VLM counts as the primary source
            vlm_ripe = vlm_result.get("ripe_count", 0)
            vlm_semi = vlm_result.get("semi_ripe_count", 0)
            vlm_unripe = vlm_result.get("unripe_count", 0)

            # Re-verify VLM counts match the total (sanitization)
            if vlm_ripe + vlm_semi + vlm_unripe == 0 and vlm_count > 0:
                # If counts are missing but total exists, assume mostly unripe/semi
                vlm_unripe = vlm_count

            # Create simulated detections for yield estimation (85x85 pixels)
            fake_detections = []
            for i in range(vlm_ripe):
                fake_detections.append({"bbox": [0, 0, 85, 85], "label": "ripe", "confidence": 0.0, "source": "vlm"})
            for i in range(vlm_semi):
                fake_detections.append({"bbox": [0, 0, 85, 85], "label": "semi_ripe", "confidence": 0.0, "source": "vlm"})
            for i in range(vlm_unripe):
                fake_detections.append({"bbox": [0, 0, 85, 85], "label": "unripe", "confidence": 0.0, "source": "vlm"})

            estimated_yield = self.yield_estimator.estimate(
                fake_detections,
                growth_retardant=growth_retardant,
                training_system=training_system
            )

            final = {
                "total_fruits": vlm_count,
                "ripe": vlm_ripe,
                "semi_ripe": vlm_semi,
                "unripe": vlm_unripe,
                "estimated_yield_kg": estimated_yield,
                "architecture": architecture,
                "detections": fake_detections,
                "analysis_source": "vlm_primary",
            }
        else:
            # Neither detected fruits
            final = {
                "total_fruits": 0,
                "ripe": 0,
                "semi_ripe": 0,
                "unripe": 0,
                "estimated_yield_kg": 0,
                "architecture": architecture,
                "detections": [],
                "analysis_source": "none",
            }

        # Add harvest timeline prediction
        final["harvest_timeline"] = {
            "ripe": "Ready for Harvest",
            "semi_ripe": "3-5 Days",
            "unripe": "10-14 Days"
        }

        # Always attach VLM insights if available
        if vlm_result:
            final["ai_insights"] = {
                "source": vlm_result.get("source", "unknown"),
                "fruit_count": vlm_result.get("fruit_count", 0),
                "ripeness_summary": vlm_result.get("ripeness_summary", ""),
                "observations": vlm_result.get("observations", ""),
                "health_notes": vlm_result.get("health_notes", ""),
                "growth_stage": vlm_result.get("growth_stage", ""),
                "confidence": vlm_result.get("confidence", "low"),
            }
        else:
            final["ai_insights"] = None

        return final
