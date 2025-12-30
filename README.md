# 🛡️ Fake Transaction Detector

![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Backend: Flask](https://img.shields.io/badge/Backend-Flask%20%2B%20Python-green)
![Style: Fintech Premium](https://img.shields.io/badge/Style-Fintech%20Premium-purple)

A professional-grade financial anomaly detection system featuring a premium "Fintech" UI, robust backend processing, and seamless dark/light mode integration. Upload a transaction CSV to instantly detect potential fraud, visualized through dynamic, theme-aware charts.

---

## 📋 Table of Contents
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [API Usage](#-api-usage)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)

---

## 🚀 Live Demo
- **Frontend (Vercel):** [Click Here to View Dashboard](https://pro-dp.vercel.app/)
- **Backend (Render):** [Click Here to View API Status](https://pro-dp-1.onrender.com)

---

## 🌟 Features

### 🎨 Premium UI/UX
- **Glassmorphism Design**: Modern, translucent aesthetics with frosted glass effects.
- **Dual Theme Support**: 
    - ☀️ **Light Mode**: Vibrant Electric Blue & Soft Cloud White.
    - 🌙 **Dark Mode**: Cyber Black & Neon Green (Eye-friendly optimized).
- **Smooth Animations**: Staggered entrance animations, hover physics, and simulated functional loading states.
- **Responsive**: Fully distinct views for "Upload" and "Dashboard" states.

### 🧠 Intelligent Backend
- **Fraud Detection**: Analyzes transaction patterns to flag high-risk anomalies.
- **Dual-Theme Graph Generation**: Automatically generates two sets of charts (Light & Dark) for every analysis to ensure perfect visual integration with the frontend.
- **Crash-Proof**: Configured with `matplotlib` non-interactive backend (`Agg`) to run reliably on headless servers.

### 🤖 ML Model Architecture
The core detection engine (`backend/model/anomaly_model.py`) uses an advanced **Unsupervised Ensemble** approach:
1.  **Algorithms**: Combines **Isolation Forest** (Density-based), **DBSCAN** (Clustering), and **Elliptic Envelope** (Statistical) for robust anomaly validation.
2.  **Feature Engineering**: Automatically extracts over **100+ behavioral features** including:
    - *Velocity*: Transactions per minute/hour.
    - *Geography*: Impossible travel speed, new IP addresses.
    - *User Patterns*: Deviations from personal spending habits (Z-Scores).
3.  **Explainability**: Every flagged transaction includes a specific "Reason" (e.g., *"Large location change > 500km"*) so users understand **why** it was flagged.

---

## ✨ Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1️⃣ Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

# Development Run
python app.py

# Production Run (Simulated)
gunicorn app:app
```
*Server runs on http://127.0.0.1:5000*

### 2️⃣ Frontend Setup
```bash
cd frontend
npm install

# Create local env file if needed
echo "VITE_API_BASE_URL=http://127.0.0.1:5000" > .env.development

npm run dev
```
*App runs on http://localhost:5173*

---

## 🔌 API Usage

**Endpoint:** `POST /predict`
- **Body:** `multipart/form-data` with key `file` (CSV)

**Response Example:**
```json
{
  "total_transactions": 1000,
  "anomaly_count": 12,
  "high_risk_percent": 1.2,
  "graphs": {
    "risk_distribution": {
      "light": "/outputs/risk_distribution_light.png",
      "dark": "/outputs/risk_distribution_dark.png"
    },
    "amount_vs_risk": {
      "light": "/outputs/amount_vs_risk_light.png",
      "dark": "/outputs/amount_vs_risk_dark.png"
    },
    ...
  }
}
```

---

## ☁️ Deployment Guides

### **Backend (Render)**
1. Connect your repo to Render.
2. Select **Web Service**.
3. Set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**: `gunicorn app:app`
5. Deploy!

### **Frontend (Vercel)**
1. Connect your repo to Vercel.
2. Import the `frontend` directory.
3. Set **Environment Variable**: 
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.onrender.com`
4. Deploy!

---

## 🧩 Project Structure

```
├── backend/
│   ├── app.py             # Main Flask server (with Dual Graph logic)
│   ├── Procfile           # Production entry point
│   ├── requirements.txt   # Python dependencies
│   ├── uploads/           # Temp storage for uploads
│   └── outputs/           # Generated graph schematics
│
├── test_file/         # Sample CSVs for testing (Use these to test the app)
└── frontend/
    ├── src/
    │   ├── components/    # UI Components (UploadCSV, MetricsCard, GraphCard)
    │   ├── pages/         # Dashboard (Main View logic)
    │   └── index.css      # Styles (Themes, Animations, Tailwind)
    │
    ├── .env.development   # Local API configuration
    └── package.json       # Frontend dependencies
```

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.
