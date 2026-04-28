from ultralytics import YOLO

class Detector:
    def __init__(self, model_path):
        self.model = YOLO(model_path)

    def detect(self, image):
        results = self.model(image, conf=0.15)[0]

        boxes = results.boxes.xyxy.cpu().numpy()
        confs = results.boxes.conf.cpu().numpy()

        detections = []
        for box, conf in zip(boxes, confs):
            x1, y1, x2, y2 = map(int, box)

            detections.append({
                "bbox": [x1, y1, x2, y2],
                "confidence": float(conf)
            })

        return detections