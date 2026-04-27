import torch
import torchvision.transforms as transforms
from PIL import Image
import timm
from torch import nn

class Classifier:
    def __init__(self, model_path):
        # The .pth is a state_dict for efficientnet_b3 with a custom head
        self.model = timm.create_model('efficientnet_b3', pretrained=False)
        self.model.classifier = nn.Sequential(
            nn.BatchNorm1d(1536),
            nn.Dropout(0.2),
            nn.Linear(1536, 4)
        )
        
        state_dict = torch.load(model_path, map_location="cpu")
        self.model.load_state_dict(state_dict)
        self.model.eval()

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor()
        ])

        # The model has 4 outputs. Added 'other' to prevent IndexError
        self.classes = ["unripe", "semi_ripe", "ripe", "other"]

    def predict(self, crop):
        image = Image.fromarray(crop)
        tensor = self.transform(image).unsqueeze(0)

        with torch.no_grad():
            outputs = self.model(tensor)
            _, pred = torch.max(outputs, 1)

        return self.classes[pred.item()]
