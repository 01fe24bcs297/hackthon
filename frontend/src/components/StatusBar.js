import React from "react";
 
function StatusBar({ status, isOnline }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: isOnline ? "#1a3325" : "#342700",
      color: isOnline ? "#3fb950" : "#d29922",
      border: `1px solid ${isOnline ? "#2a5c3a" : "#5c4400"}`,
    }}>
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: "currentColor",
        animation: "blink 1.4s infinite",
      }} />
      <span>{status || (isOnline ? "🟢 Demo Mode" : "🟡 Offline")}</span>
 
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
 
export default StatusBar;
