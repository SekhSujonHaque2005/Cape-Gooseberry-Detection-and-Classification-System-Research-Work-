from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import shutil
import os

from services.pipeline import Pipeline

app = FastAPI()

pipeline = Pipeline(
    detection_model_path="models/detection/best.pt",
    classification_model_path="models/classification/best_model_rgb.pth"
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "AI Server Running 🚀"}


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    growth_retardant: str = Form("none"),
    training_system: str = Form("standard"),
    nutrient_management: str = Form("standard")
):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = pipeline.process(
            file_path, 
            growth_retardant=growth_retardant, 
            training_system=training_system
        )
        
        # Add nutrient management to response (could affect ripening analysis in future)
        result["nutrient_management"] = nutrient_management

        return JSONResponse(content=result)

    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )
