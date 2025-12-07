# 🛡️ SMS Spam Detector

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)

**Aplikasi web untuk mendeteksi SMS spam dalam Bahasa Indonesia menggunakan Machine Learning**

[Demo](#demo) • [Fitur](#fitur) • [Instalasi](#instalasi) • [Penggunaan](#penggunaan) • [Tech Stack](#tech-stack)

</div>

---

## 📖 Deskripsi

SMS Spam Detector adalah aplikasi berbasis web yang dapat mengklasifikasikan SMS dalam Bahasa Indonesia ke dalam 3 kategori:

| Label | Kategori | Deskripsi |
|-------|----------|-----------|
| 0 | **Normal** | SMS biasa dari kontak pribadi |
| 1 | **Fraud/Penipuan** | SMS penipuan atau scam |
| 2 | **Promo** | SMS promosi dari operator/brand |

Aplikasi ini menggunakan algoritma **Naive Bayes Multinomial** dengan **TF-IDF Vectorizer** untuk klasifikasi teks.

---

## ✨ Fitur

- 🔍 **Deteksi Real-time** - Klasifikasi SMS secara instan
- 📊 **Confidence Score** - Menampilkan tingkat kepercayaan prediksi
- 📈 **Probability Breakdown** - Visualisasi probabilitas setiap kategori
- 🎨 **UI Modern** - Antarmuka yang indah dengan animasi smooth
- 🌙 **Dark Mode Support** - Mendukung tema gelap
- 📱 **Responsive** - Tampilan optimal di semua perangkat

---

## 🎬 Demo

### Screenshot

<div align="center">
<img src="docs/screenshot.png" alt="SMS Spam Detector Screenshot" width="800"/>
</div>

### Hasil Pengujian

| SMS | Prediksi | Confidence |
|-----|----------|------------|
| "Selamat! Anda memenangkan hadiah 100jt..." | Fraud/Penipuan | **98.6%** |
| "Jadwal kuliah Machine Learning besok jam 10..." | Normal | **99.8%** |
| "PROMO! Beli paket data 10GB hanya 50rb..." | Promo | **99.0%** |

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Web framework Python yang cepat
- **scikit-learn** - Library machine learning
- **Sastrawi** - Indonesian text stemmer & stopword remover
- **Pandas & NumPy** - Data manipulation

### Frontend
- **Next.js 16** - React framework
- **Tailwind CSS v4** - Utility-first CSS
- **shadcn/ui** - UI component library
- **Framer Motion** - Animation library

### Machine Learning
- **Algorithm**: Multinomial Naive Bayes
- **Feature Extraction**: TF-IDF Vectorizer
- **Preprocessing**: Tokenization, Stemming, Stopword Removal

---

## 📦 Instalasi

### Prerequisites

- Python 3.10 atau lebih baru
- Node.js 18 atau lebih baru
- npm atau yarn

### 1. Clone Repository

```bash
git clone https://github.com/kresando/SMS-Spam-Detector.git
cd SMS-Spam-Detector
```

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Buat virtual environment
python -m venv venv

# Aktivasi virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train model (pertama kali saja)
python -m app.ml.train

# Jalankan server
uvicorn app.main:app --reload --port 8000
```

### 3. Setup Frontend

```bash
# Buka terminal baru, masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

### 4. Akses Aplikasi

- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **API Health Check**: http://localhost:8000/api/health

---

## 🚀 Penggunaan

### Via Web Interface

1. Buka http://localhost:3000
2. Masukkan teks SMS pada textarea
3. Klik tombol "Deteksi SMS"
4. Lihat hasil prediksi beserta confidence score

### Via API

```bash
# Prediksi SMS
curl -X POST "http://localhost:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "Selamat! Anda memenangkan hadiah 100jt"}'
```

Response:
```json
{
  "text": "Selamat! Anda memenangkan hadiah 100jt",
  "label": 1,
  "label_name": "Fraud/Penipuan",
  "confidence": 0.986,
  "probabilities": {
    "Normal": 0.003,
    "Fraud/Penipuan": 0.986,
    "Promo": 0.011
  }
}
```

---

## 📁 Struktur Project

```
SMS-Spam-Detector/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── routers/
│   │   │   └── prediction.py    # API endpoints
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic schemas
│   │   ├── services/
│   │   │   └── ml_service.py    # ML prediction service
│   │   └── ml/
│   │       ├── preprocess.py    # Text preprocessing
│   │       ├── train.py         # Model training
│   │       └── trained_model.pkl
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Main page
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/ui/           # shadcn components
│   ├── lib/
│   │   ├── api.ts               # API service
│   │   └── types.ts             # TypeScript types
│   └── package.json
├── dataset_sms_spam_v1.csv      # Dataset
└── README.md
```

---

## 📊 Dataset

Dataset yang digunakan adalah SMS Spam Indonesia v1.0 yang berisi:

- **Total data**: 1143 SMS
- **Label 0 (Normal)**: 569 data
- **Label 1 (Fraud)**: 335 data
- **Label 2 (Promo)**: 239 data

Sumber: Rahmi, F. and Wibisono, Y. (2016). "Aplikasi SMS Spam Filtering pada Android menggunakan Naive Bayes"

---

## 📈 Model Performance

| Metric | Score |
|--------|-------|
| Accuracy | ~95% |
| Precision (weighted) | ~95% |
| Recall (weighted) | ~95% |
| F1-Score (weighted) | ~95% |

---

## 👥 Tim

**Machine Learning Final Project 2025**

---

## 📝 Lisensi

Project ini dibuat untuk keperluan akademis (Final Project Machine Learning).

Dataset: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

---

<div align="center">
Made with ❤️ using Next.js & FastAPI
</div>
