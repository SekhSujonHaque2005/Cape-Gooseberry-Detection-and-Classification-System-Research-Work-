FROM python:3.11-slim

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements from the ai-service folder
COPY ai-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything from the ai-service folder into the container
COPY ai-service/ .

# Ensure models are included (they are inside ai-service/models)
# The LFS files will be pulled automatically by Hugging Face

RUN mkdir -p uploads && chmod 777 uploads

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
