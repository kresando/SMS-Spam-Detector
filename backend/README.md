# SMS Spam Detector Backend

Backend API untuk mendeteksi SMS spam dalam Bahasa Indonesia menggunakan Machine Learning.

## Tech Stack

- **Framework**: FastAPI
- **ML Model**: Naive Bayes Multinomial + TF-IDF
- **NLP**: Sastrawi (Indonesian stemmer)
- **Language**: Python 3.10+

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Train Model

```bash
python -m app.ml.train
```

### 4. Run Server

```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/api/health` | Health check |
| POST | `/api/predict` | Predict single SMS |
| POST | `/api/predict/batch` | Predict batch SMS |

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Labels

| Code | Label | Deskripsi |
|------|-------|-----------|
| 0 | Normal | SMS biasa/normal |
| 1 | Fraud/Penipuan | SMS penipuan |
| 2 | Promo | SMS promosi |

## Example Request

```bash
curl -X POST "http://localhost:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "Selamat! Anda memenangkan hadiah 100jt. Hub 08123456789"}'
```

## Example Response

```json
{
  "text": "Selamat! Anda memenangkan hadiah 100jt. Hub 08123456789",
  "label": 1,
  "label_name": "Fraud/Penipuan",
  "confidence": 0.95,
  "probabilities": {
    "Normal": 0.02,
    "Fraud/Penipuan": 0.95,
    "Promo": 0.03
  }
}
```
