"""
ML Service for SMS Spam Prediction
Handles model loading and prediction logic
"""

import os
from pathlib import Path
from typing import Dict, Tuple, Optional

import joblib
import numpy as np

from app.ml.preprocess import preprocess_text


# Label mapping
LABEL_NAMES = {
    0: "Normal",
    1: "Fraud/Penipuan",
    2: "Promo"
}


class MLService:
    """Service for loading and using the trained ML model."""
    
    def __init__(self):
        self.model = None
        self.model_path = Path(__file__).parent.parent / "ml" / "trained_model.pkl"
    
    def load_model(self) -> bool:
        """Load the trained model from disk."""
        if not self.model_path.exists():
            print(f"Warning: Model file not found at {self.model_path}")
            return False
        
        try:
            self.model = joblib.load(self.model_path)
            print(f"Model loaded successfully from {self.model_path}")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    
    def is_model_loaded(self) -> bool:
        """Check if model is loaded."""
        return self.model is not None
    
    def predict(self, text: str) -> Tuple[int, str, float, Dict[str, float]]:
        """
        Predict the label for a single SMS text.
        
        Returns:
            Tuple of (label, label_name, confidence, probabilities)
        """
        if not self.is_model_loaded():
            raise RuntimeError("Model not loaded. Please train the model first.")
        
        # Preprocess the text
        processed_text = preprocess_text(text)
        
        # Get prediction and probabilities
        label = self.model.predict([processed_text])[0]
        proba = self.model.predict_proba([processed_text])[0]
        
        # Get confidence (max probability)
        confidence = float(np.max(proba))
        
        # Create probability dict
        probabilities = {
            LABEL_NAMES[i]: float(p) 
            for i, p in enumerate(proba)
        }
        
        return int(label), LABEL_NAMES[label], confidence, probabilities
    
    def predict_batch(self, texts: list) -> list:
        """Predict labels for multiple SMS texts."""
        return [self.predict(text) for text in texts]


# Singleton instance
_ml_service: Optional[MLService] = None


def get_ml_service() -> MLService:
    """Get or create singleton ML service instance."""
    global _ml_service
    if _ml_service is None:
        _ml_service = MLService()
        _ml_service.load_model()
    return _ml_service
