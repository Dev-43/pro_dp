# 🛡️ Fraud & Anomaly Detection Dashboard

![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Backend: Flask](https://img.shields.io/badge/Backend-Flask%20%2B%20Python-green)
![Model: Isolation Forest](https://img.shields.io/badge/Model-Isolation%20Forest-orange)

A concise full‑stack example for detecting anomalies in financial transaction data. Upload a CSV and the backend analyzes transactions (Isolation Forest + feature engineering), returns summary metrics and generated charts for visualization.

---

## 📋 Table of contents
- [Live demo](#-live-demo)
- [Features](#-features)
- [Quick start](#-quick-start)
- [API / Usage](#-api--usage)
- [Model](#-model)
- [Project structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Live demo
- **Frontend (Dashboard):** https://pro-dp.vercel.app/ *(update with your deployment)*
- **Backend (API):** https://pro-dp-1.onrender.com *(update with your deployment)*

---

## 🌟 Features
- CSV upload (form `file` field).
- Unsupervised anomaly detection (Isolation Forest ensemble available in `backend/model/`).
- Auto-generated visualizations saved to `backend/outputs/`.
- Simple JSON response with summary metrics and links to charts.

---

## ✨ Quick start
Prerequisites: Python 3.10+, Node 18+, Git.

1) Backend

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

The Flask server will run on http://127.0.0.1:5000.

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and upload a CSV to analyze.

---

## 🔌 API / Usage
- GET / -> health/status
- POST /predict -> accepts a multipart/form-data request with key `file` (CSV)
- GET /outputs/<filename> -> serves generated chart images

Example: upload `transactions.csv` using curl

```bash
curl -X POST "http://127.0.0.1:5000/predict" \
  -F "file=@transactions.csv"
```

Example response (trimmed):

```json
{
  "total_transactions": 1000,
  "anomaly_count": 120,
  "high_risk_percent": 12.0,
  "graphs": {
    "risk_distribution": "/outputs/risk_distribution.png",
    "time_series": "/outputs/time_series.png"
  }
}
```

Notes:
- The API saves uploaded files to `backend/uploads/` and outputs charts to `backend/outputs/`.
- Update `frontend/src/services/api.ts` to point to the correct backend URL for local/dev workflows.

---

## 🧠 Model
The repository contains a robust detector implementation at `backend/model/anomaly_model.py` (class `EliteFraudDetector`) that:
- Engineers dozens of behavioral and temporal features
- Trains an ensemble (IsolationForest, DBSCAN, EllipticEnvelope)
- Produces risk scores and explanations for flagged transactions

The lightweight endpoint (`/predict`) currently demonstrates the end-to-end flow; you can integrate `EliteFraudDetector` into the Flask route for production-grade inference.

---

## 🧩 Project structure
```
backend/        # Flask app, model, uploads/outputs
frontend/       # React + Vite dashboard
README.md
```

---

## Contributing
Contributions welcome — please open issues or PRs. Add tests, documentation, or improvements to model explainability.

---

## License
MIT — see `LICENSE` for details.

---

If you want, I can also add a short example CSV, a sample `curl` script, or a screenshot of the dashboard. Let me know which you'd prefer.
