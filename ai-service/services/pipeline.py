import cv2

from services.detect import Detector
from services.classify import Classifier
from services.yield_estimator import YieldEstimator
from services.architecture import ArchitectureAnalyzer


class Pipeline:
    def __init__(self, detection_model_path, classification_model_path):
        self.detector = Detector(detection_model_path)
        self.classifier = Classifier(classification_model_path)
        self.yield_estimator = YieldEstimator()
        self.architecture_analyzer = ArchitectureAnalyzer()

    def process(self, image_path, growth_retardant="none", training_system="standard"):
        image = cv2.imread(image_path)

        if image is None:
            raise ValueError("Image not found or invalid format")

        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

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
        architecture = self.architecture_analyzer.analyze(image_rgb)

        return {
            "total_fruits": total,
            "ripe": ripe,
            "semi_ripe": semi,
            "unripe": unripe,
            "estimated_yield_kg": estimated_yield,
            "architecture": architecture,
            "detections": results
        }
