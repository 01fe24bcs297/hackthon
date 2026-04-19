import React from "react";
import "./Controls.css";

function Controls({ setRouteKey, eta, status, routeKey, isOnline }) {
  return (
    <div className="control-card">

      <h2 className="title">🚍 Bus Tracker</h2>

      {/* STATUS */}
      <div className="section">
        <span className="label">Status</span>
        <span className={`status ${
          status.includes("Live") ? "live" :
          status.includes("Weak") ? "weak" : "offline"
        }`}>
          {status}
        </span>
      </div>

      {/* ETA */}
      <div className="section eta-box">
        <span className="label">ETA</span>
        <span className="eta">{eta}</span>
      </div>

      {/* ROUTE */}
      <div className="section">
        <span className="label">Route</span>
        <span className="route">{routeKey}</span>
      </div>

      {/* BUTTONS */}
      <div className="buttons">
        <button onClick={() => setRouteKey("KLE-Unkal")}>
          KLE → Unkal
        </button>

        <button onClick={() => setRouteKey("Unkal-City")}>
          Unkal → City
        </button>
      </div>

    </div>
  );
}

export default Controls;