# 🌍 Eco Sense — Setup Guide

## 📌 Overview

Eco Sense is an AI-powered environmental monitoring system that analyzes ecological data, detects anomalies, and predicts environmental risks using a multi-parameter model.

---

## ⚙️ Backend Setup (FastAPI)

### 1. Create Virtual Environment

Run the following command to create a virtual environment:

```bash
python -m venv .venv
```

---

### 2. Activate Virtual Environment

#### Windows:

```bash
.venv\Scripts\activate
```

#### Mac/Linux:

```bash
source .venv/bin/activate
```

---

### 3. Install Required Dependencies

Install all required Python packages:

```bash
pip install fastapi uvicorn pandas numpy scikit-learn python-multipart python-dotenv
```

OR (if using requirements.txt):

```bash
pip install -r requirements.txt
```

---

### 4. Run the Backend Server

```bash
uvicorn app.main:app --reload
```

The backend will start at:
http://127.0.0.1:8000

---

## 🖥️ Frontend Setup (React + Vite)

### 1. Install Dependencies

```bash
npm install
```

---

### 2. Run Frontend

```bash
npm run dev
```

The frontend will run at:
http://localhost:5173

---

## 📊 Features

* Environmental data ingestion (CSV)
* Multi-parameter risk analysis
* Anomaly detection
* Predictive insights
* Interactive dashboard (map + charts)
* Chatbot-based query system

---

## 🧠 Risk Model Parameters

Eco Sense calculates environmental risk using:

* Temperature
* Water Quality (Pollution Index)
* Humidity
* NDVI (Vegetation / Chlorophyll proxy)
* Wind
* Trend Rate

---

## ⚠️ Notes

* Ensure backend is running before starting frontend
* Keep CSV dataset ready for upload
* Use `.venv` to avoid dependency conflicts

---

## 🚀 Tech Stack

* Frontend: React, Tailwind CSS, Recharts, React Leaflet
* Backend: FastAPI, Python
* Data/ML: Pandas, NumPy, Scikit-learn

---

## 👨‍💻 Project Name

Eco Sense
