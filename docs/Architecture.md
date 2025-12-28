# 🏗️ System Architecture & Logic Documentation

This document explains the internal working of the Fraud Detection System, focusing on the Machine Learning model and the data flow between Frontend and Backend.

## 1. High-Level Architecture
The application follows a **Client-Server Architecture**:

1.  **Client (React):** Handles user interaction, file uploads, and displaying results.
2.  **Server (Flask):** Acts as a REST API. It receives the file, processes it, runs the ML model, and generates static image files for graphs.
3.  **Storage:** Temporarily stores uploaded CSVs and generated PNG images on the server's filesystem.

---

## 2. Machine Learning Logic (`backend/model/anomaly_model.py`)

We use the **Isolation Forest** algorithm from `scikit-learn`.

### **Why Isolation Forest?**
Traditional fraud detection requires a dataset of "known fraud" (Supervised Learning). However, in real-world finance, fraud is rare and constantly changing.
* **Unsupervised Learning:** Isolation Forest does not need labeled "fraud" data.
* **How it works:** It randomly selects a feature and splits the data. Anomalies (outliers) are few and different, so they are isolated quickly (in fewer splits) compared to normal points.
* **Contamination Parameter:** We set `contamination=0.1` (10%), assuming roughly 10% of transactions might be outliers.

### **Code Flow:**
1.  **Input:** Pandas DataFrame containing transaction amounts.
2.  **Training:** The model `fit(X)` learns the distribution of the "Amount" column.
3.  **Prediction:**
    * Returns `-1` for Anomaly.
    * Returns `1` for Normal.
4.  **Scoring:** We calculate a `risk_score` by inverting the model's decision function. Higher score = Higher risk.

---

## 3. Backend Workflow (`app.py`)

The `/predict` endpoint is the core of the backend.

1.  **Request Handling:** Receives a POST request containing the `.csv` file.
2.  **UUID Generation:** Generates a unique ID (e.g., `a1b2-c3d4`) for the session. This ensures that if two users upload files at the same time, their graphs don't overwrite each other.
3.  **Preprocessing:** Checks if the required columns (like `amount`) exist.
4.  **Model Execution:** Calls `detect_anomalies(df)` to append `is_anomaly` and `risk_score` columns.
5.  **Visualization:**
    * Uses `matplotlib` with the `Agg` backend (non-GUI) to generate PNG images.
    * Saves images to `outputs/` folder.
6.  **Response:** Returns a JSON object containing:
    * Summary statistics (Total transactions, Anomaly count).
    * URLs pointing to the generated graphs (served via `send_from_directory`).

---

## 4. Frontend Integration (`frontend/src`)

### **API Service (`services/api.ts`)**
* Configured with a `baseURL` pointing to the Render backend (`https://pro-dp-1.onrender.com`).
* Uses `axios` to handle the `multipart/form-data` request required for file uploads.

### **Dashboard Logic (`Dashboard.tsx`)**
1.  **State Management:** Uses `useState` to handle loading states, file selection, and response data.
2.  **Rendering:**
    * Displays **MetricCards** for high-level summary.
    * Maps over the returned `graphs` object to display images.
    * The `img src` tags dynamically append the Backend URL to the image paths returned by the API.

---

## 5. Deployment Challenges & Solutions

### **CORS (Cross-Origin Resource Sharing)**
* **Problem:** The Frontend (Vercel) and Backend (Render) live on different domains. Browsers block this by default.
* **Solution:** We used `flask_cors` in `app.py` to explicitly allow requests from the frontend.

### **Ephemeral Filesystem (Render Free Tier)**
* **Constraint:** Render's free tier spins down (sleeps) after inactivity, and disk storage is temporary.
* **Impact:** Generated graphs disappear if the server restarts.
* **Handling:** The application regenerates graphs on every new request, ensuring the user always sees fresh data.
