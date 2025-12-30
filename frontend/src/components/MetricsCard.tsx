import { motion } from "framer-motion";

interface MetricsCardProps {
  title: string;
  value: string | number;
  textColor?: string; 
  /* We can ignore colorClass or map it to our new vars if needed, 
     but let's just rely on textColor or internal styles */
}

export default function MetricsCard({ title, value, textColor }: MetricsCardProps) {
  // Determine border color based on text color hint for a nice glow effect
  // This is a simple heuristic mapping
  const borderColor = textColor?.includes("red") ? "var(--danger)" :
                      textColor?.includes("yellow") ? "var(--warning)" : "var(--accent-color)";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card"
      style={{ padding: "1.5rem", textAlign: "center", borderLeft: `4px solid ${borderColor}` }}
    >
      <span style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "1px" }}>
        {title}
      </span>
      <h3 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
        {value}
      </h3>
    </motion.div>
  );
}
