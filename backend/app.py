from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend to prevent Tkinter errors
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

# ---------------- FOLDERS ----------------
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# ---------------- HOME ROUTE ----------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Backend running successfully",
        "endpoint": "/predict (POST)"
    })

# ---------------- PREDICT ----------------
@app.route("/predict", methods=["POST"])
def predict():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        # Save CSV
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        # Read CSV
        df = pd.read_csv(file_path)

        total_tx = len(df)
        anomaly_count = int(total_tx * 0.12)
        high_risk_percent = round((anomaly_count / total_tx) * 100, 2)

        # ---------------- HELPER FOR DUAL THEME GRAPHS ----------------
        graphs = {}

        def save_graph(fig_func, filename_base):
            # 1. Light Theme
            plt.style.use('default')
            plt.rcParams.update({
                'figure.facecolor': 'white',
                'axes.facecolor': '#f0f4f8',
                'axes.edgecolor': '#d9e2ec',
                'text.color': '#102a43',
                'axes.labelcolor': '#102a43',
                'xtick.color': '#486581',
                'ytick.color': '#486581',
                'grid.color': '#e1e4e8',
                'font.family': 'sans-serif'
            })
            
            fig = plt.figure(figsize=(10, 6))
            fig_func(is_dark=False)
            plt.tight_layout()
            
            light_filename = f"{filename_base}_light.png"
            plt.savefig(os.path.join(OUTPUT_FOLDER, light_filename), transparent=False)
            plt.close(fig)

            # 2. Dark Theme
            # Reset and apply dark style
            plt.style.use('dark_background')
            plt.rcParams.update({
                'figure.facecolor': '#0a0a0a', # Matches frontend --bg-primary
                'axes.facecolor': '#141414',   # Matches frontend --bg-secondary
                'axes.edgecolor': '#333333',
                'text.color': '#f0f0f0',
                'axes.labelcolor': '#a0aec0',
                'xtick.color': '#a0aec0',
                'ytick.color': '#a0aec0',
                'grid.color': '#2d3748',
                'grid.alpha': 0.3
            })

            fig = plt.figure(figsize=(10, 6))
            fig_func(is_dark=True)
            plt.tight_layout()
            
            dark_filename = f"{filename_base}_dark.png"
            plt.savefig(os.path.join(OUTPUT_FOLDER, dark_filename), transparent=False)
            plt.close(fig)

            graphs[filename_base] = {
                "light": f"/outputs/{light_filename}",
                "dark": f"/outputs/{dark_filename}"
            }

        # ---------------- GRAPH 1: Risk Distribution ----------------
        def plot_risk(is_dark):
            color = '#00c785' if is_dark else '#3366FF'
            df["amount"].plot(kind="hist", color=color, alpha=0.7, bins=30)
            plt.title("Risk Distribution", fontsize=14, fontweight='bold')
            plt.grid(True, linestyle='--')
        
        save_graph(plot_risk, "risk_distribution")

        # ---------------- GRAPH 2: Amount vs Risk ----------------
        def plot_amount_risk(is_dark):
            color = '#00c785' if is_dark else '#3366FF'
            plt.scatter(df.index, df["amount"], color=color, alpha=0.5, s=15)
            plt.title("Amount vs Risk", fontsize=14, fontweight='bold')
            plt.xlabel("Transaction Index")
            plt.ylabel("Amount")
            plt.grid(True, linestyle='--')

        save_graph(plot_amount_risk, "amount_vs_risk")

        # ---------------- GRAPH 3: Anomaly Pie ----------------
        def plot_pie(is_dark):
            colors = ['#ff4d4f', '#2d3748'] if is_dark else ['#ef4444', '#d9e2ec']
            text_color = 'white' if is_dark else 'black'
            
            plt.pie(
                [anomaly_count, total_tx - anomaly_count],
                labels=["Anomaly", "Normal"],
                autopct="%1.1f%%",
                colors=colors,
                textprops={'color': text_color, 'fontsize': 12},
                wedgeprops={'edgecolor': 'none'}
            )
            plt.title("Anomaly Breakdown", fontsize=14, fontweight='bold')

        save_graph(plot_pie, "anomaly_pie")

        # ---------------- GRAPH 4: Risk Bar ----------------
        def plot_bar(is_dark):
             colors = ['#00c785', '#ffaa00', '#ff4d4f'] if is_dark else ['#10b981', '#f59e0b', '#ef4444']
             plt.bar(["Low", "Medium", "High"], [50, 30, 20], color=colors)
             plt.title("Risk Level Distribution", fontsize=14, fontweight='bold')
             plt.grid(axis='y', linestyle='--', alpha=0.3)

        save_graph(plot_bar, "risk_bar")

        # ---------------- GRAPH 5: Time Series ----------------
        def plot_time_series(is_dark):
            color = '#00c785' if is_dark else '#3366FF'
            df.groupby(df.index // 10).size().plot(color=color, linewidth=2)
            plt.title("Transactions Over Time", fontsize=14, fontweight='bold')
            plt.grid(True, linestyle='--')
            plt.fill_between(df.groupby(df.index // 10).size().index, df.groupby(df.index // 10).size().values, color=color, alpha=0.1)

        save_graph(plot_time_series, "time_series")

        # ---------------- FLAGGED TRANSACTIONS LIST ----------------
        # Simulate flagged transactions: 
        # For this demo without the full ML model running, we will flag the top anomaly_count transactions
        # and generate deterministic reasons based on their properties.
        
        df_sorted = df.sort_values(by="amount", ascending=False).head(anomaly_count)
        flagged_list = []
        import random 

        stats_mean = df["amount"].mean()
        stats_std = df["amount"].std()

        for index, row in df_sorted.iterrows():
             amount = row.get("amount", 0)
             risk_score = min(99, int(70 + (amount / df["amount"].max()) * 29)) # Score proportional to amount

             # Deterministic Reason Logic
             reasons = []
             if amount > (stats_mean + 2 * stats_std):
                 reasons.append("Unusually High Amount")
             
             # Fallback/Additional simulated reasons based on index for variety in demo
             if index % 5 == 0:
                 reasons.append("Round Number Anomaly")
             if index % 7 == 0:
                 reasons.append("Rapid Velocity")
             
             if not reasons:
                 reasons.append("Statistical Outlier")

             flagged_list.append({
                 "transaction_id": row.get("transaction_id", f"TXN-{index}"),
                 "amount": amount,
                 "timestamp": row.get("timestamp", "N/A"),
                 "risk_score": risk_score,
                 "reason": " | ".join(reasons)
             })

        # ---------------- RESPONSE ----------------
        return jsonify({
            "total_transactions": total_tx,
            "anomaly_count": anomaly_count,
            "high_risk_percent": high_risk_percent,
            "graphs": graphs,
            "flagged_transactions": flagged_list
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- SERVE IMAGES ----------------
@app.route("/outputs/<filename>")
def serve_output(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
