import torch
import torchvision.transforms as transforms
from PIL import Image
import timm
from torch import nn
import cv2
import numpy as np
import os
import logging

logger = logging.getLogger(__name__)

class Classifier:
    def __init__(self, model_dir):
        """
        Ensemble Classifier using RGB, HSV, and LAB color space models.
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.classes = ["unripe", "semi_ripe", "ripe", "other"]
        
        # Mapping space to expected filename
        self.models_config = {
            "rgb": "best_model_rgb.pth",
            "hsv": "best_model_hsv.pth",
            "lab": "best_model_lab.pth"
        }
        
        self.models = {}
        
        for space, filename in self.models_config.items():
            path = os.path.join(model_dir, filename)
            if os.path.exists(path):
                try:
                    model = self._load_model(path)
                    self.models[space] = model
                    logger.info(f"Loaded ensemble model: {filename} ({space})")
                except Exception as e:
                    logger.error(f"Failed to load model {filename}: {e}")
            else:
                logger.warning(f"Model not found: {path}. Skipping {space} space.")

        if not self.models:
            raise RuntimeError("No classification models could be loaded from " + model_dir)

        self.transform = transforms.Compose([
            transforms.Resize((300, 300)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406],
                                 [0.229, 0.224, 0.225])
        ])

    def _load_model(self, path):
        model = timm.create_model('efficientnet_b3', pretrained=False)
        model.classifier = nn.Sequential(
            nn.BatchNorm1d(1536),
            nn.Dropout(0.2),
            nn.Linear(1536, 4)
        )
        state_dict = torch.load(path, map_location=self.device, weights_only=True)
        model.load_state_dict(state_dict)
        model.to(self.device)
        model.eval()
        return model

    def _convert_space(self, crop_rgb, space):
        """Convert RGB crop to target color space."""
        if space == "rgb":
            return crop_rgb
        elif space == "hsv":
            # BGR for OpenCV
            bgr = cv2.cvtColor(crop_rgb, cv2.COLOR_RGB2BGR)
            hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
            return hsv
        elif space == "lab":
            bgr = cv2.cvtColor(crop_rgb, cv2.COLOR_RGB2BGR)
            lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
            return lab
        return crop_rgb

    def predict(self, crop_rgb):
        """
        Predict ripeness using an ensemble of all available models.
        Uses soft voting (averaging probabilities).
        """
        all_probs = []

        for space, model in self.models.items():
            try:
                # Convert crop to the space the model was trained on
                space_crop = self._convert_space(crop_rgb, space)
                image = Image.fromarray(space_crop)
                tensor = self.transform(image).unsqueeze(0).to(self.device)

                with torch.no_grad():
                    outputs = model(tensor)
                    probs = torch.softmax(outputs, dim=1)
                    all_probs.append(probs)
            except Exception as e:
                logger.error(f"Inference failed for {space} model: {e}")

        if not all_probs:
            return "other"

        # Soft voting: average probabilities across all models
        avg_probs = torch.mean(torch.stack(all_probs), dim=0)
        _, pred = torch.max(avg_probs, 1)

        return self.classes[pred.item()]
