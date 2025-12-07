"""
Pydantic Schemas for API Request/Response
"""

from pydantic import BaseModel, Field
from typing import Optional, List


class PredictionRequest(BaseModel):
    """Request body for SMS prediction."""
    text: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="SMS text to classify",
        examples=["Selamat! Anda memenangkan hadiah 100jt. Hubungi 08123456789"]
    )


class PredictionResponse(BaseModel):
    """Response body for SMS prediction."""
    text: str = Field(..., description="Original input text")
    label: int = Field(..., description="Predicted label (0=Normal, 1=Fraud, 2=Promo)")
    label_name: str = Field(..., description="Human-readable label name")
    confidence: float = Field(..., description="Prediction confidence (0-1)")
    probabilities: dict = Field(..., description="Probability for each class")


class BatchPredictionRequest(BaseModel):
    """Request body for batch SMS prediction."""
    texts: List[str] = Field(
        ...,
        min_length=1,
        max_length=100,
        description="List of SMS texts to classify"
    )


class BatchPredictionResponse(BaseModel):
    """Response body for batch SMS prediction."""
    predictions: List[PredictionResponse]
    total: int


class HealthResponse(BaseModel):
    """Response body for health check."""
    status: str = Field(default="healthy")
    model_loaded: bool = Field(..., description="Whether ML model is loaded")
    version: str = Field(default="1.0.0")
