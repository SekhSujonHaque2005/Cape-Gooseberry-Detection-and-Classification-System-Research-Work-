import base64
import json
import re
import logging
import io
from PIL import Image
from huggingface_hub import InferenceClient

logger = logging.getLogger(__name__)


class VLMAnalyzer:
    """
    Vision-Language Model analyzer using Hugging Face Inference API.
    Always produces meaningful results for any image, any angle, any situation.
    """

    # Each entry is (model_id, provider) — tried in order until one works
    # provider is passed to InferenceClient constructor, not chat_completion
    # Verified working combinations as of April 2026
    MODEL_CONFIGS = [
        ("Qwen/Qwen3-VL-8B-Instruct", "novita"),
        ("meta-llama/Llama-4-Scout-17B-16E-Instruct", "groq"),
        ("google/gemma-4-26B-A4B-it", "novita"),
        ("google/gemma-3-12b-it", "featherless-ai"),
        ("zai-org/GLM-4.6V-Flash", "novita"),
        ("google/gemma-3n-E4B-it", "together"),
    ]

    PROMPT = """You are an expert agricultural AI assistant specialized in Cape Gooseberry (Physalis peruviana) fruit analysis.

Analyze this image carefully, regardless of camera quality, lighting, or angle. Even if the image is from a 'Remote Lens' with potential motion blur or varied distance, provide the most accurate assessment possible.

Rules:
- Count ALL visible cape gooseberry fruits (including those partially hidden or inside husks)
- Classify each fruit's ripeness: "ripe" (golden/orange), "semi_ripe" (yellowish/light green), "unripe" (green/dark green)
- If the image is a close-up, analyze what you can see; if it's a wide shot, estimate the total visible fruit set
- If no cape gooseberry fruits are visible, set fruit_count to 0 and explain what you see instead
- ALWAYS respond with valid JSON only, no extra text

{
  "fruit_count": <number>,
  "ripe_count": <number>,
  "semi_ripe_count": <number>,
  "unripe_count": <number>,
  "ripeness_summary": "<brief description of ripeness distribution>",
  "observations": "<detailed observation about the fruit/plant health, color, husk condition, size, maturity>",
  "health_notes": "<any signs of disease, pest damage, deficiency, or note if healthy>",
  "growth_stage": "<e.g. flowering, fruiting, mature, harvest-ready>",
  "confidence": "<high/medium/low based on image clarity>"
}"""

    def __init__(self, hf_token: str = None):
        self.hf_token = hf_token
        self.model_name = None
        self.provider = None
        
        if not hf_token:
            logger.warning("No HF_TOKEN provided. VLM analyzer will be disabled.")
            self.hf_token = None
            return

        logger.info("VLM Analyzer initialized — will auto-select model on first call.")

    def _image_to_base64(self, image_path: str) -> str:
        """Read image and resize if it exceeds max dimensions to save bandwidth/API limits."""
        with Image.open(image_path) as img:
            # Max dimension 1600px is plenty for VLM analysis while keeping base64 small
            max_size = 1600
            if max(img.size) > max_size:
                ratio = max_size / max(img.size)
                new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
                img = img.resize(new_size, Image.LANCZOS)
            
            # Convert to RGB if necessary
            if img.mode != "RGB":
                img = img.convert("RGB")
                
            buffered = io.BytesIO()
            img.save(buffered, format="JPEG", quality=85)
            return base64.b64encode(buffered.getvalue()).decode("utf-8")

    def _parse_response(self, text: str) -> dict:
        """Robustly parse JSON from VLM response, handling markdown code blocks etc."""
        # Try to extract JSON from markdown code block
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
        if json_match:
            text = json_match.group(1)
        else:
            # Try to find raw JSON object
            json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', text, re.DOTALL)
            if json_match:
                text = json_match.group(0)

        try:
            data = json.loads(text)
            # Validate and sanitize
            return {
                "fruit_count": max(0, int(data.get("fruit_count", 0))),
                "ripe_count": max(0, int(data.get("ripe_count", 0))),
                "semi_ripe_count": max(0, int(data.get("semi_ripe_count", 0))),
                "unripe_count": max(0, int(data.get("unripe_count", 0))),
                "ripeness_summary": str(data.get("ripeness_summary", "")),
                "observations": str(data.get("observations", "")),
                "health_notes": str(data.get("health_notes", "")),
                "growth_stage": str(data.get("growth_stage", "")),
                "confidence": str(data.get("confidence", "low")),
            }
        except (json.JSONDecodeError, ValueError, TypeError) as e:
            logger.warning(f"Failed to parse VLM JSON: {e}. Raw text: {text[:200]}")
            # Return a best-effort result from raw text
            return {
                "fruit_count": 0,
                "ripe_count": 0,
                "semi_ripe_count": 0,
                "unripe_count": 0,
                "ripeness_summary": "",
                "observations": text[:500] if text else "Analysis could not be parsed.",
                "health_notes": "",
                "growth_stage": "",
                "confidence": "low",
            }

    def analyze(self, image_path: str) -> dict | None:
        """
        Analyze an image using the VLM.
        Tries multiple model+provider combinations until one succeeds.
        Returns structured analysis dict, or None if all fail.
        """
        if not self.hf_token:
            return None

        try:
            base64_image = self._image_to_base64(image_path)
            image_url = f"data:image/jpeg;base64,{base64_image}"

            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "image_url", "image_url": {"url": image_url}},
                        {"type": "text", "text": self.PROMPT},
                    ],
                }
            ]

            # Try each model+provider combo
            for model_id, provider in self.MODEL_CONFIGS:
                try:
                    # Create a new InferenceClient per provider attempt
                    # The provider param goes in the constructor, NOT in chat_completion
                    client = InferenceClient(
                        provider=provider,
                        token=self.hf_token,
                    )

                    response = client.chat.completions.create(
                        model=model_id,
                        messages=messages,
                        max_tokens=1024,
                    )
                    raw_text = response.choices[0].message.content
                    
                    result = self._parse_response(raw_text)
                    result["source"] = f"{model_id.split('/')[-1]} ({provider})"
                    
                    self.model_name = model_id
                    self.provider = provider
                    logger.info(f"VLM success with {model_id} via {provider}")
                    return result

                except Exception as e:
                    logger.warning(f"VLM attempt failed [{model_id} via {provider}]: {e}")
                    continue

            logger.error("All VLM model+provider combinations failed.")
            return None

        except Exception as e:
            logger.error(f"VLM analysis failed: {e}")
            return None
