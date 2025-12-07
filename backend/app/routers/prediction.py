"""
Prediction Router - API endpoints for SMS spam detection
"""

from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    PredictionRequest,
    PredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse,
    HealthResponse
)
from app.services.ml_service import get_ml_service


router = APIRouter(prefix="/api", tags=["Prediction"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check API health and model status."""
    ml_service = get_ml_service()
    return HealthResponse(
        status="healthy",
        model_loaded=ml_service.is_model_loaded(),
        version="1.0.0"
    )


@router.post("/predict", response_model=PredictionResponse)
async def predict_sms(request: PredictionRequest):
    """
    Predict whether an SMS is Normal, Fraud, or Promo.
    
    - **text**: The SMS content to classify
    
    Returns prediction with label, confidence, and probabilities.
    """
    ml_service = get_ml_service()
    
    if not ml_service.is_model_loaded():
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please train the model first."
        )
    
    try:
        label, label_name, confidence, probabilities = ml_service.predict(request.text)
        
        return PredictionResponse(
            text=request.text,
            label=label,
            label_name=label_name,
            confidence=confidence,
            probabilities=probabilities
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@router.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(request: BatchPredictionRequest):
    """
    Predict labels for multiple SMS texts.
    
    - **texts**: List of SMS contents to classify (max 100)
    
    Returns list of predictions.
    """
    ml_service = get_ml_service()
    
    if not ml_service.is_model_loaded():
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please train the model first."
        )
    
    try:
        predictions = []
        for text in request.texts:
            label, label_name, confidence, probabilities = ml_service.predict(text)
            predictions.append(PredictionResponse(
                text=text,
                label=label,
                label_name=label_name,
                confidence=confidence,
                probabilities=probabilities
            ))
        
        return BatchPredictionResponse(
            predictions=predictions,
            total=len(predictions)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Batch prediction failed: {str(e)}"
        )
