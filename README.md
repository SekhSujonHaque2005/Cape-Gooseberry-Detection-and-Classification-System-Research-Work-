---
title: Gooseberry AI Backend
emoji: 🍇
colorFrom: yellow
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# Cape Gooseberry AI (Physalis peruviana Monitoring System)

An advanced, precision-farming AI system designed for the autonomous detection, classification, and yield forecasting of Cape Gooseberries. 

![Project Header](frontend/public/editorial-hero.png)

## 🌟 Key Features

- **Hybrid Analysis Pipeline**: Combines **YOLOv8** for precise object detection and **Hugging Face VLMs** for semantic fallback in dense foliage.
- **Multi-Space Ensemble Classification**: Utilizes an ensemble of **RGB, HSV, and LAB** EfficientNet-B3 models to achieve superior ripeness accuracy across varying lighting conditions.
- **Smart Harvest Forecasting**: Predicts market readiness timelines (Ready Now, 3-5 Days, 10-14 Days) based on maturity spectrum.
- **PWA Frontend**: A high-end, editorial-grade interface that supports **Remote Lens** (Live Camera) captures on iOS and Android.
- **Scientific Controls**: Incorporates growth retardant data (CCC, Paclobutrazol) and canopy training systems into the yield model.

## 🏗️ Architecture

The system is split into two main components:
1. **Frontend**: Next.js 14 Progressive Web App (PWA).
2. **AI Service**: FastAPI backend orchestrating multiple ML models.

## 🚀 Deployment

### Backend (AI Service)
The backend is Dockerized and ready for deployment on **Hugging Face Spaces** or any containerized platform.
- **Port**: 7860
- **Environment Variables**: `HF_TOKEN` (for VLM access).

### Frontend (Next.js)
Optimized for deployment on **Vercel**.
- **Environment Variables**: `NEXT_PUBLIC_API_URL` (points to the AI Service).

## 🛠️ Tech Stack
- **Vision**: YOLOv8, EfficientNet-B3, timm, OpenCV.
- **LLM/VLM**: Qwen-VL / Llama-VL via Hugging Face.
- **Backend**: FastAPI, PyTorch.
- **Frontend**: Next.js, Tailwind CSS, Lucide Icons.

---
*Research Work - Developed for Precision Agriculture.*
