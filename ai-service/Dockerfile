FROM python:3.11-slim

# Install system dependencies for OpenCV and other ML libs
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create uploads directory with correct permissions
RUN mkdir -p uploads && chmod 777 uploads

# Expose the port
EXPOSE 7860

# Run the application
# HF Spaces expects the app on port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
