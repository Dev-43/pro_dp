import { useState, useEffect } from "react";
import { saveAs } from "file-saver"; 
import UploadCSV from "../components/UploadCSV";
import MetricsCard from "../components/MetricsCard";
import { Moon, Sun, Download, BarChart3, ShieldCheck, Plus, ArrowUp } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// Production Backend URL for Images
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pro-dp-1.onrender.com";

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.1 // Faster start
    }
  },
  exit: { 
    opacity: 0,
    y: -10, // Reduced movement
    transition: { duration: 0.2 } // Faster exit
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 }, // Subtle movement
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 20 } // Less bouncy, more stable
  }
};

// --- Recharts Imports Removed ---

// --- Graph Card Component (Dual Theme Support) ---
const GraphCard = ({ title, src, theme }: { title: string, src: { light: string, dark: string }, theme: string }) => (
  <motion.div 
    variants={itemVariants}
    className="glass-card"
    whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
    style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
  >
    <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)", background: "rgba(255,255,255,0.02)" }}>
      <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ padding: "0.4rem", borderRadius: "8px", background: "rgba(var(--accent-color), 0.1)" }}>
          <BarChart3 size={18} color="var(--accent-color)" />
        </div>
        {title}
      </h3>
    </div>
    <div style={{ padding: "1.5rem", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px", position: "relative" }}>
      <motion.img 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        // Toggle image source based on theme prop
        src={`${API_BASE_URL}${theme === 'dark' ? src.dark : src.light}`} 
        key={theme} // Force re-render/animate on theme switch
        alt={title} 
        style={{ 
          maxWidth: "100%", 
          maxHeight: "350px",
          borderRadius: "8px", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }} 
        loading="lazy"
      />
    </div>
  </motion.div>
);

function Dashboard() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [view, setView] = useState<"upload" | "dashboard">("upload");
  const [metrics, setMetrics] = useState<any>(null);
  const [graphs, setGraphs] = useState<any>(null);
  const [flaggedTransactions, setFlaggedTransactions] = useState<any[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleAnalysisResult = (data: any) => {
    setMetrics({
      total: data.total_transactions,
      anomalies: data.anomaly_count,
      risk: data.high_risk_percent,
    });
    setGraphs(data.graphs);
    setFlaggedTransactions(data.flagged_transactions || []);
    setView("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewUpload = () => {
    setView("upload");
    setMetrics(null);
    setGraphs(null);
  };

  const downloadCSV = () => {
    if (!metrics || !flaggedTransactions) return;
    
    // 1. Summary Section
    let csvContent = `Total Transactions,${metrics.total}\nAnomalies Detected,${metrics.anomalies}\nHigh Risk %,${metrics.risk}\n\n`;
    
    // 2. Detailed Table Section
    csvContent += "Serial No,Transaction ID,Amount,Risk Score,Reason Detected\n";
    
    flaggedTransactions.forEach((txn, index) => {
       // Escape commas in reason to prevent column shifting
       const safeReason = `"${txn.reason.replace(/"/g, '""')}"`; 
       csvContent += `${index + 1},${txn.transaction_id},${txn.amount},${txn.risk_score},${safeReason}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "fraud_analysis_report.csv");
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "4rem", position: "relative", overflowX: "hidden" }}>
      
      {/* Background Decor */}
      <div style={{
        position: "fixed", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%",
        background: "radial-gradient(circle at 50% 50%, rgba(var(--accent-color), 0.03) 0%, transparent 50%)",
        zIndex: -1, pointerEvents: "none", animation: "pulse 10s infinite"
      }} />

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="glass" 
        style={{ position: "sticky", top: 0, zIndex: 100, padding: "1rem 0" }}
      >
        <div className="container flex-center" style={{ justifyContent: "space-between" }}>
          <div className="flex-center" style={{ gap: "0.75rem", cursor: "pointer" }} onClick={() => setView("upload")}>
            <motion.div 
               style={{ 
                 width: "42px", height: "42px", 
                 background: "linear-gradient(135deg, var(--accent-color), var(--accent-hover))", 
                 borderRadius: "10px", 
                 display: "flex", alignItems: "center", justifyContent: "center",
                 boxShadow: "0 4px 15px var(--accent-glow)"
               }}>
               <ShieldCheck color="#fff" size={24} />
            </motion.div>
            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
              Fraud<span style={{ color: "var(--accent-color)" }}>Guard</span>
            </span>
          </div>
          
          <div className="flex-center" style={{ gap: "1rem" }}>
            <AnimatePresence>
              {view === "dashboard" && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                  onClick={handleNewUpload}
                  className="btn-primary flex-center"
                  style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", gap: "0.4rem" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} /> New Upload
                </motion.button>
              )}
            </AnimatePresence>

            <motion.button 
              onClick={toggleTheme} 
              className="glass-card flex-center"
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ 
                width: "40px", height: "40px", padding: 0, borderRadius: "50%",
                border: "1px solid var(--border-color)", boxShadow: "none"
              }}
            >
              {theme === "light" ? <Moon size={18} color="var(--text-primary)" /> : <Sun size={18} color="var(--text-primary)" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <main className="container" style={{ paddingTop: "3rem" }}>
        <AnimatePresence mode="wait">
          
          {/* UPLOAD VIEW */}
          {view === "upload" ? (
            <motion.div 
              key="upload-view"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
            >
              <div style={{ marginBottom: "3rem" }}>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-gradient" 
                  style={{ fontSize: "3.5rem", marginBottom: "1rem", letterSpacing: "-0.04em" }}
                >
                  Fake Transaction Detector
                </motion.h1>
                <motion.p 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                   style={{ color: "var(--text-secondary)", fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto" }}
                >
                   AI-powered analysis to detect irregularities in your financial transactions instantly.
                </motion.p>
              </div>

              <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }} 
                 animate={{ scale: 1, opacity: 1 }} 
                 transition={{ delay: 0.6, type: "spring" }}
              >
                <UploadCSV onResult={handleAnalysisResult} />
              </motion.div>
            </motion.div>
          ) : (
            
            /* DASHBOARD VIEW */
            <motion.div
              key="dashboard-view"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                 <motion.div variants={itemVariants}>
                    <h2 style={{ fontSize: "2.5rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>Analysis Report</h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Comprehensive breakdown of transaction risks.</p>
                 </motion.div>
                 <motion.button 
                   variants={itemVariants}
                   onClick={downloadCSV}
                   className="btn-secondary flex-center"
                   whileHover={{ scale: 1.05, borderColor: "var(--accent-color)" }}
                   whileTap={{ scale: 0.95 }}
                   style={{ gap: "0.5rem" }}
                 >
                   <Download size={18} /> Export CSV
                 </motion.button>
              </header>

              {/* Metrics Section */}
              {metrics && (
                <motion.section variants={containerVariants} style={{ marginBottom: "3rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                    <motion.div variants={itemVariants}><MetricsCard title="Total Transactions" value={metrics.total.toLocaleString()} textColor="var(--text-primary)" /></motion.div>
                    <motion.div variants={itemVariants}><MetricsCard title="Anomalies Detected" value={metrics.anomalies.toLocaleString()} textColor="text-red-500" /></motion.div>
                    <motion.div variants={itemVariants}><MetricsCard title="High Risk Percentage" value={`${metrics.risk}%`} textColor="text-yellow-500" /></motion.div>
                  </div>
                </motion.section>
              )}

              {/* Graphs Section */}
              {graphs && (
                <motion.section variants={containerVariants}>
                   <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                      <h2 style={{ fontSize: "1.8rem", color: "var(--text-primary)" }}>Visual Insights</h2>
                      <div style={{ height: "1px", flex: 1, background: "var(--border-color)" }}></div>
                   </motion.div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "2rem" }}>
                    <GraphCard title="Risk Score Distribution" src={graphs.risk_distribution} theme={theme} />
                    <GraphCard title="Amount vs Risk" src={graphs.amount_vs_risk} theme={theme} />
                    <GraphCard title="Anomaly Breakdown" src={graphs.anomaly_pie} theme={theme} />
                    <GraphCard title="Risk Level Count" src={graphs.risk_bar} theme={theme} />
                    <div style={{ gridColumn: "1 / -1" }}>
                       <GraphCard title="Transaction Frequency Over Time" src={graphs.time_series} theme={theme} />
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Flagged Transactions Table */}
              {flaggedTransactions && flaggedTransactions.length > 0 && (
                <motion.section variants={containerVariants} style={{ marginTop: "4rem" }}>
                   <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                      <h2 style={{ fontSize: "1.8rem", color: "var(--danger)" }}>Flagged Anomalies</h2>
                      <div style={{ height: "1px", flex: 1, background: "var(--border-color)" }}></div>
                   </motion.div>

                   <motion.div variants={itemVariants} className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--text-primary)" }}>
                           <thead>
                              <tr style={{ background: "rgba(var(--accent-color), 0.05)", borderBottom: "1px solid var(--border-color)" }}>
                                 <th style={{ padding: "1rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)", width: "80px" }}>SR. NO</th>
                                 <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.9rem", color: "var(--text-secondary)" }}>TRANSACTION ID</th>
                                 <th style={{ padding: "1rem", textAlign: "right", fontSize: "0.9rem", color: "var(--text-secondary)" }}>AMOUNT</th>
                                 <th style={{ padding: "1rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>RISK SCORE</th>
                                 <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.9rem", color: "var(--text-secondary)" }}>REASON DETECTED</th>
                              </tr>
                           </thead>
                           <tbody>
                              {flaggedTransactions.map((txn: any, idx: number) => (
                                 <tr key={idx} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                    <td style={{ padding: "1rem", textAlign: "center", color: "var(--text-secondary)" }}>{idx + 1}</td>
                                    <td style={{ padding: "1rem", fontWeight: 500 }}>{txn.transaction_id}</td>
                                    <td style={{ padding: "1rem", textAlign: "right", fontWeight: 600 }}>${txn.amount.toLocaleString()}</td>
                                    <td style={{ padding: "1rem", textAlign: "center" }}>
                                       <span style={{ 
                                          padding: "0.25rem 0.6rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 700,
                                          background: txn.risk_score > 90 ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
                                          color: txn.risk_score > 90 ? "#ef4444" : "#f59e0b"
                                       }}>
                                          {txn.risk_score}/100
                                       </span>
                                    </td>
                                    <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{txn.reason}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                      </div>
                      <div style={{ padding: "1rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)", background: "rgba(0,0,0,0.02)" }}>
                         Showing top flagged transactions from analysis
                      </div>
                   </motion.div>
                </motion.section>
              )}

              {/* Scroll to Top Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                style={{
                  position: "fixed", bottom: "2rem", right: "2rem",
                  width: "50px", height: "50px", borderRadius: "50%",
                  background: "var(--accent-color)", color: "#fff",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 100, border: "none", cursor: "pointer"
                }}
              >
                 <ArrowUp size={24} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer style={{ 
        textAlign: "center", padding: "3rem 1rem", marginTop: "auto", 
        color: "var(--text-secondary)", fontSize: "0.9rem"
      }}>
        <p style={{ opacity: 0.7 }}>&copy; {new Date().getFullYear()} FraudGuard AI. Enterprise Grade Security.</p>
      </footer>
    </div>
  );
}

export default Dashboard;