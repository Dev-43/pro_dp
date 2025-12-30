import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";
import { uploadCSV } from "../services/api";

type UploadResult = {
  total_transactions: number;
  anomaly_count: number;
  high_risk_percent: number;
  graphs: {
    risk_distribution: string;
    amount_vs_risk: string;
    anomaly_pie: string;
    risk_bar: string;
    time_series: string;
  };
};

type Props = {
  onResult: (data: UploadResult) => void;
};

const UploadCSV = ({ onResult }: Props) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Only CSV files are allowed.");
        return;
    }

    setFileName(file.name);
    setError("");
    setLoading(true);


    try {
      const data = await uploadCSV(file);
      if (data.error) {
         setError(data.error);
      } else {
         onResult(data);
      }
    } catch (err) {
      setError("Failed to process transaction file. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [onResult]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    disabled: loading
  });

  return (
    <div className="glass-card" style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <div 
        {...getRootProps()} 
        style={{
          border: "2px dashed var(--border-color)",
          borderRadius: "12px",
          padding: "3rem 1.5rem",
          cursor: loading ? "wait" : "pointer",
          background: isDragActive ? "rgba(var(--accent-color), 0.05)" : "transparent",
          borderColor: isDragActive || fileName ? "var(--accent-color)" : "var(--border-color)",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {loading ? (
             <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex-center"
               style={{ flexDirection: "column", gap: "1rem" }}
             >
                <Loader2 size={48} className="animate-spin" color="var(--accent-color)" />
                <p style={{ color: "var(--text-secondary)" }}>Analyzing the transactions...</p>
             </motion.div>
          ) : fileName && !error ? (
             <motion.div
               key="success"
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="flex-center"
               style={{ flexDirection: "column", gap: "1rem" }}
             >
                <CheckCircle size={56} color="var(--success)" />
                <div>
                   <h3 style={{ margin: 0, color: "var(--text-primary)" }}>Analysis Complete</h3>
                   <p style={{ margin: "0.5rem 0 0", color: "var(--text-secondary)" }}>{fileName}</p>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--accent-color)", marginTop: "1rem" }}>Drag another file to reset</p>
             </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
            >
               <div style={{ 
                 background: "var(--bg-primary)", 
                 padding: "1rem", 
                 borderRadius: "50%", 
                 display: "inline-flex"
               }}>
                  <UploadCloud size={32} color="var(--accent-color)" />
               </div>
               <div>
                 <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                    {isDragActive ? "Drop the file here" : "Upload Transaction CSV"}
                 </h3>
                 <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "300px", margin: "0 auto" }}>
                    Drag and drop your file here, or click to browse.
                 </p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
             initial={{ opacity: 0, height: 0 }} 
             animate={{ opacity: 1, height: "auto" }}
             exit={{ opacity: 0, height: 0 }}
             style={{ 
               marginTop: "1.5rem", 
               padding: "1rem", 
               borderRadius: "8px", 
               background: "rgba(239, 68, 68, 0.1)", 
               color: "var(--danger)",
               display: "flex",
               alignItems: "center",
               gap: "0.5rem",
               justifyContent: "center"
             }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={(e) => { e.stopPropagation(); setError(""); }} style={{ marginLeft: "auto" }}><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadCSV;
