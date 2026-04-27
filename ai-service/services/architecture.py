import cv2
import numpy as np

class ArchitectureAnalyzer:
    def __init__(self):
        pass

    def analyze(self, image_rgb):
        # 1. Canopy Density (Greenness)
        # Convert to HSV for better color segmentation
        hsv = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2HSV)
        
        # Define range for green color (leaves)
        lower_green = np.array([35, 40, 40])
        upper_green = np.array([85, 255, 255])
        
        mask = cv2.inRange(hsv, lower_green, upper_green)
        green_pixels = cv2.countNonZero(mask)
        total_pixels = image_rgb.shape[0] * image_rgb.shape[1]
        
        canopy_density = (green_pixels / total_pixels) * 100
        
        # 2. Branch Complexity (Edge Density)
        gray = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, 100, 200)
        edge_pixels = cv2.countNonZero(edges)
        
        branch_complexity = (edge_pixels / total_pixels) * 1000 # Scaling for readability
        
        # 3. Structural Score (Combining factors)
        # Higher complexity and density usually mean a more "vigorous" architecture
        structural_score = (canopy_density * 0.6) + (branch_complexity * 0.4)
        
        return {
            "canopy_density_percent": round(canopy_density, 2),
            "branch_complexity_score": round(branch_complexity, 2),
            "structural_score": round(structural_score, 2),
            "status": "Vigorous" if structural_score > 50 else "Moderate" if structural_score > 20 else "Sparse"
        }
