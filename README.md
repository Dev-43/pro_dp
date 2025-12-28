# 🛡️ Fraud & Anomaly Detection Dashboard

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Flask](https://img.shields.io/badge/Backend-Flask%20%2B%20Python-green)
![ML](https://img.shields.io/badge/Model-Isolation%20Forest-orange)
![Deploy](https://img.shields.io/badge/Deployed-Vercel%20%26%20Render-purple)

A full-stack Machine Learning application that detects anomalies in financial transaction data. Users can upload a CSV file, and the system uses an **Isolation Forest** algorithm to identify high-risk transactions, generating interactive visualizations and downloadable reports.

## 🚀 Live Demo
- **Frontend (Dashboard):** [https://pro-dp.vercel.app/](https://pro-dp-alpha.vercel.app/) *(Replace with your actual Vercel Link)*
- **Backend (API):** [https://pro-dp-1.onrender.com](https://pro-dp-1.onrender.com)

---

## 🌟 Key Features
* **CSV Upload:** Drag-and-drop support for financial datasets.
* **ML-Powered Analysis:** Uses `scikit-learn`'s **Isolation Forest** to detect outliers without needing labeled training data.
* **Data Visualization:** Generates 5 dynamic charts (Risk Distribution, Time Series, etc.) using `matplotlib`.
* **Risk Scoring:** Automatically assigns a "Risk Score" and flags transactions as Normal or Anomalous.
* **Export Reports:** Download a summary CSV of the analysis results.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React 18 (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (via CDN/Classes)
* **HTTP Client:** Axios

### **Backend**
* **Framework:** Flask (Python 3.10+)
* **ML Library:** Scikit-learn (Isolation Forest)
* **Data Processing:** Pandas, NumPy
* **Visualization:** Matplotlib (Agg backend)

---

## 📂 Project Structure

```bash
├── backend/
│   ├── model/
│   │   └── anomaly_model.py  # ML Logic (Isolation Forest)
│   ├── app.py                # Flask API Routes
│   ├── requirements.txt      # Python Dependencies
│   └── vercel.json           # Config (optional)
├── frontend/
│   ├── src/
│   │   ├── components/       # Dashboard, GraphCard, MetricCard
│   │   ├── services/         # API.ts (Axios config)
│   │   └── App.tsx           # Main Router
│   └── package.json          # React Dependencies
└── README.md

```

---

## 🏃‍♂️ Running Locally

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
# Server runs at [http://127.0.0.1:5000](http://127.0.0.1:5000)

```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173

```

*Note: To run locally, ensure `frontend/src/services/api.ts` points to `http://127.0.0.1:5000` instead of the Render URL.*

---

## 🔮 Future Improvements

* Add authentication (Login/Signup).
* Switch image storage to AWS S3 (currently local filesystem).
* Support for real-time transaction streaming (WebSockets).

## 📄 License

This project is open-source and available under the MIT License.



---
