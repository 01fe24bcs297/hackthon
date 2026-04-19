import React from "react";
 
const ROUTE_META = {
  "KLE-Unkal":  { label: "KLE → Unkal",   badge: "B1", color: "#4f8ef7", dimColor: "#1c2d42", stops: "7 stops · ~3.5 km" },
  "Unkal-City": { label: "Unkal → City",   badge: "B2", color: "#22c97e", dimColor: "#0d3320", stops: "5 stops · ~2.2 km" },
  "City-Campus":{ label: "City → Campus",  badge: "B3", color: "#a78bfa", dimColor: "#2d1b52", stops: "6 stops · ~4.1 km" },
};
 
function Controls({ setRouteKey, routeKey }) {
  return (
    <div style={{ padding: "12px 16px", borderBottom: "1px solid #30363d" }}>
      <div style={{
        fontSize: 10, fontWeight: 600, color: "#484f58",
        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8
      }}>
        Select Route
      </div>
 
      {Object.entries(ROUTE_META).map(([key, meta]) => {
        const isActive = routeKey === key;
        return (
          <button
            key={key}
            onClick={() => setRouteKey(key)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "10px 12px",
              borderRadius: 10, marginBottom: 6,
              border: `1px solid ${isActive ? meta.color : "#30363d"}`,
              background: isActive ? meta.dimColor : "#1c2330",
              cursor: "pointer", textAlign: "left",
              transition: "all 0.15s",
              outline: "none",
            }}
          >
            {/* Color dot */}
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: meta.color, flexShrink: 0
            }} />
 
            {/* Route info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3" }}>
                {meta.label}
              </div>
              <div style={{ fontSize: 11, color: "#484f58", marginTop: 2 }}>
                {meta.stops}
              </div>
            </div>
 
            {/* Badge */}
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 7px",
              borderRadius: 6, background: meta.dimColor,
              color: meta.color, fontFamily: "monospace",
              border: `1px solid ${meta.color}44`
            }}>
              {meta.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
 
export default Controls;