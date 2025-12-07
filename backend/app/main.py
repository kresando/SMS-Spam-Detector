"""
FastAPI Main Application Entry Point
SMS Spam Detector API
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import prediction
from app.services.ml_service import get_ml_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - load model on startup."""
    # Startup: Load ML model
    print("Loading ML model...")
    ml_service = get_ml_service()
    if ml_service.is_model_loaded():
        print("ML model loaded successfully!")
    else:
        print("Warning: ML model not loaded. Please run training first.")
    
    yield
    
    # Shutdown: Cleanup if needed
    print("Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="SMS Spam Detector API",
    description="""
    API untuk mendeteksi SMS spam dalam Bahasa Indonesia.
    
    ## Kategori
    - **Normal (0)**: SMS biasa/normal
    - **Fraud/Penipuan (1)**: SMS penipuan atau fraud
    - **Promo (2)**: SMS promosi dari operator/brand
    
    ## Endpoints
    - `POST /api/predict` - Prediksi SMS tunggal
    - `POST /api/predict/batch` - Prediksi batch SMS
    - `GET /api/health` - Health check
    """,
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(prediction.router)


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": "SMS Spam Detector API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }
