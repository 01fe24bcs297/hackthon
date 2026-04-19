
import React from "react";
 
function SignalBars({ level }) {
  const heights = [4, 7, 10, 13];
  const labels = ["No signal", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#f85149", "#f85149", "#d29922", "#22c97e", "#22c97e"];
  return (
    <div>
      <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 14, marginBottom: 3 }}>
        {heights.map((h, i) => (
          <div
            key={i}
            style={{
              width: 4, height: h, borderRadius: 1,
              background: i < level ? colors[level] : "#30363d",
              transition: "background 0.3s"
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 10, color: "#484f58" }}>{labels[level] || "Strong"}</div>
    </div>
  );
}
 
function ETABox({ eta, routeKey, route, speed, signal, nextStop, passengers }) {
  const etaSec = (() => {
    if (!eta || eta === "--") return 120;
    const parts = eta.split(":");
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  })();
  const barPct = Math.max(5, 100 - (etaSec / 270) * 100);
 
  return (
    <div style={{ padding: "0 0 8px" }}>
      {/* ETA Card */}
      <div style={{
        margin: "12px 16px 0",
        borderRadius: 14,
        background: "linear-gradient(135deg, #1c2d42 0%, #1c2330 100%)",
        border: "1px solid #2a4a6e",
        overflow: "hidden",
      }}>
        <div style={{ padding: "12px 14px 10px" }}>
          <div style={{
            fontSize: 10, fontWeight: 600, color: "#484f58",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4
          }}>
            Estimated Arrival
          </div>
          <div style={{
            fontSize: 30, fontWeight: 700, color: "#58a6ff",
            fontFamily: "monospace", lineHeight: 1
          }}>
            {eta === "--" ? "--:--" : eta}
          </div>
          <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>
            {route?.stopNames?.[0]} → {route?.stopNames?.[route.stopNames.length - 1]}
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 3, background: "#0d1117" }}>
          <div style={{
            height: 3, background: "#58a6ff",
            width: barPct + "%", transition: "width 0.6s ease"
          }} />
        </div>
      </div>
 
      {/* Stats grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 8, padding: "12px 16px 0"
      }}>
        {/* Speed */}
        <div style={{
          background: "#1c2330", border: "1px solid #30363d",
          borderRadius: 10, padding: "10px 12px"
        }}>
          <div style={{ fontSize: 10, color: "#484f58", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
            Speed
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace", color: "#58a6ff" }}>
            {speed || "—"}
          </div>
          <div style={{ fontSize: 10, color: "#484f58" }}>km/h</div>
        </div>
 
        {/* Signal */}
        <div style={{
          background: "#1c2330", border: "1px solid #30363d",
          borderRadius: 10, padding: "10px 12px"
        }}>
          <div style={{ fontSize: 10, color: "#484f58", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
            Signal
          </div>
          <SignalBars level={signal || 3} />
        </div>
 
        {/* Next stop */}
        <div style={{
          background: "#1c2330", border: "1px solid #30363d",
          borderRadius: 10, padding: "10px 12px"
        }}>
          <div style={{ fontSize: 10, color: "#484f58", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
            Next Stop
          </div>
          <div style={{
            fontSize: 12, fontWeight: 600, color: "#d29922",
            lineHeight: 1.3, marginTop: 2
          }}>
            {nextStop || "—"}
          </div>
        </div>
 
        {/* Passengers */}
        <div style={{
          background: "#1c2330", border: "1px solid #30363d",
          borderRadius: 10, padding: "10px 12px"
        }}>
          <div style={{ fontSize: 10, color: "#484f58", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
            Passengers
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace", color: "#a78bfa" }}>
            {passengers || "—"}
          </div>
          <div style={{ fontSize: 10, color: "#484f58" }}>on board</div>
        </div>
      </div>
    </div>
  );
}
 
export default ETABox;