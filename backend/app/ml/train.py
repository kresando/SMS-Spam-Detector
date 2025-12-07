"""
Model Training Script for SMS Spam Classification
Uses TF-IDF + Multinomial Naive Bayes
"""

import os
import sys
from pathlib import Path

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.ml.preprocess import TextPreprocessor


# Label mapping
LABEL_NAMES = {
    0: "Normal",
    1: "Fraud/Penipuan", 
    2: "Promo"
}


def load_dataset(filepath: str) -> pd.DataFrame:
    """Load and validate the SMS dataset."""
    print(f"Loading dataset from: {filepath}")
    df = pd.read_csv(filepath)
    
    print(f"Dataset shape: {df.shape}")
    print(f"\nLabel distribution:")
    print(df['label'].value_counts())
    
    return df


def preprocess_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """Apply text preprocessing to the dataset."""
    print("\nPreprocessing texts...")
    preprocessor = TextPreprocessor()
    
    df = df.copy()
    df['text_clean'] = df['Teks'].apply(preprocessor.preprocess)
    
    # Remove empty texts after preprocessing
    df = df[df['text_clean'].str.len() > 0]
    
    print(f"Dataset shape after preprocessing: {df.shape}")
    return df


def train_model(X_train, y_train):
    """Train the TF-IDF + Naive Bayes pipeline."""
    print("\nTraining model...")
    
    # Create pipeline with TF-IDF and Naive Bayes
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            min_df=2,
            max_df=0.95
        )),
        ('classifier', MultinomialNB(alpha=0.1))
    ])
    
    pipeline.fit(X_train, y_train)
    print("Model training completed!")
    
    return pipeline


def evaluate_model(model, X_test, y_test):
    """Evaluate the trained model."""
    print("\n" + "="*50)
    print("MODEL EVALUATION")
    print("="*50)
    
    y_pred = model.predict(X_test)
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    
    print(f"\nAccuracy:  {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    
    # Detailed classification report
    print("\nClassification Report:")
    print(classification_report(
        y_test, y_pred,
        target_names=[LABEL_NAMES[i] for i in sorted(LABEL_NAMES.keys())]
    ))
    
    # Confusion matrix
    print("Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(cm)
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'confusion_matrix': cm.tolist()
    }


def save_model(model, filepath: str):
    """Save the trained model."""
    print(f"\nSaving model to: {filepath}")
    joblib.dump(model, filepath)
    print("Model saved successfully!")


def main():
    """Main training function."""
    # Paths - backend/app/ml/train.py -> go up 3 levels to backend, then up 1 more to project root
    ml_dir = Path(__file__).parent  # backend/app/ml
    backend_dir = ml_dir.parent.parent  # backend
    project_dir = backend_dir.parent  # Final Project
    dataset_path = project_dir / "dataset_sms_spam_v1.csv"
    model_path = ml_dir / "trained_model.pkl"
    
    # Load dataset
    df = load_dataset(str(dataset_path))
    
    # Preprocess
    df = preprocess_dataset(df)
    
    # Split data
    X = df['text_clean']
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, 
        test_size=0.2, 
        random_state=42,
        stratify=y
    )
    
    print(f"\nTraining set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    
    # Train
    model = train_model(X_train, y_train)
    
    # Evaluate
    metrics = evaluate_model(model, X_test, y_test)
    
    # Save
    save_model(model, str(model_path))
    
    print("\n" + "="*50)
    print("TRAINING COMPLETED SUCCESSFULLY!")
    print("="*50)
    
    return model, metrics


if __name__ == "__main__":
    main()
