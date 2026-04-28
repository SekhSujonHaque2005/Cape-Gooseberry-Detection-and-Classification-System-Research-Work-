from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
import uuid

from services.pipeline import Pipeline

app = FastAPI(
    title="Cape Gooseberry AI",
    description="AI-powered yield estimation & ripeness classification for Cape Gooseberry",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Hugging Face token for VLM analyzer
HF_TOKEN = os.environ.get("HF_TOKEN", None)

pipeline = Pipeline(
    detection_model_path="models/detection/best.pt",
    classification_model_path="models/classification",
    hf_token=HF_TOKEN
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

VALID_GROWTH_RETARDANTS = ["none", "CCC", "Paclobutrazol"]
VALID_TRAINING_SYSTEMS = ["standard", "2-stem", "4-stem"]
VALID_NUTRIENT_MGMT = ["standard"]


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
    file_path = None
    try:
        # Validate parameters
        if growth_retardant not in VALID_GROWTH_RETARDANTS:
            return JSONResponse(
                content={"error": f"Invalid growth_retardant. Must be one of: {VALID_GROWTH_RETARDANTS}"},
                status_code=400
            )
        if training_system not in VALID_TRAINING_SYSTEMS:
            return JSONResponse(
                content={"error": f"Invalid training_system. Must be one of: {VALID_TRAINING_SYSTEMS}"},
                status_code=400
            )

        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        if file.content_type not in allowed_types:
            return JSONResponse(
                content={"error": f"Invalid file type '{file.content_type}'. Must be JPEG or PNG."},
                status_code=400
            )

        # Use a unique filename to prevent collisions
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = pipeline.process(
            file_path, 
            growth_retardant=growth_retardant, 
            training_system=training_system
        )
        
        # Add nutrient management to response
        result["nutrient_management"] = nutrient_management

        return JSONResponse(content=result)

    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )
    finally:
        # Clean up uploaded file
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
