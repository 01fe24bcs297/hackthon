
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Controls from "./Controls";
import StatusBar from "./StatusBar";
import ETABox from "./ETABox";
 
// Fix default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
 
// Static routes
const routes = {
  "KLE-Unkal": {
    color: "#4f8ef7",
    stopNames: [
      "KLE College Gate", "Hostel Junction", "Vidyanagar Cross",
      "Unkal Lake", "Market Road", "Unkal Circle", "Unkal Bus Stand"
    ],
    coords: [
      [15.3687, 75.1231], [15.3678, 75.1220], [15.3668, 75.1212],
      [15.3657, 75.1203], [15.3645, 75.1194], [15.3630, 75.1175],
      [15.3605, 75.1150]
    ]
  },
  "Unkal-City": {
    color: "#22c97e",
    stopNames: [
      "Unkal Bus Stand", "Tilakwadi", "Sadashiv Nagar",
      "Kempwad", "City Bus Stand"
    ],
    coords: [
      [15.3605, 75.1150], [15.3585, 75.1135], [15.3565, 75.1120],
      [15.3550, 75.1105], [15.3530, 75.1075]
    ]
  },
  "City-Campus": {
    color: "#a78bfa",
    stopNames: [
      "City Bus Stand", "Gandhi Nagar", "Deshpande Nagar",
      "Vidya Nagar", "Science Block", "KLE Campus"
    ],
    coords: [
      [15.3530, 75.1075], [15.3550, 75.1055], [15.3572, 75.1040],
      [15.3595, 75.1060], [15.3620, 75.1090], [15.3650, 75.1120]
    ]
  }
};
 
function MapView() {
  const [routeKey, setRouteKey] = useState("KLE-Unkal");
  const [route, setRoute] = useState(routes["KLE-Unkal"]);
  const [position, setPosition] = useState(routes["KLE-Unkal"].coords[0]);
  const [path, setPath] = useState([]);
  const [status, setStatus] = useState("🟢 Demo Mode");
  const [eta, setEta] = useState("--");
  const [speed, setSpeed] = useState(0);
  const [signal, setSignal] = useState(4);
  const [nextStop, setNextStop] = useState("");
  const [passengers, setPassengers] = useState(20);
  const [isOnline, setIsOnline] = useState(true);
 
  const positionRef = useRef(position);
  const indexRef = useRef(0);
  const animationRef = useRef(null);
  const moveIntervalRef = useRef(null);
  positionRef.current = position;
 
  // Smooth interpolation between two GPS points
  const smoothMove = (start, end) => {
    if (!start || !end) return;
    if (animationRef.current) clearInterval(animationRef.current);
    let steps = 40;
    let i = 0;
    animationRef.current = setInterval(() => {
      if (i >= steps) { clearInterval(animationRef.current); return; }
      const lat = start[0] + (end[0] - start[0]) * (i / steps);
      const lng = start[1] + (end[1] - start[1]) * (i / steps);
      setPosition([lat, lng]);
      i++;
    }, 60);
  };
 
  // Bus icon
  const busIcon = new L.DivIcon({
    html: `<div style="
      width:36px;height:36px;background:${route.color};
      border-radius:50%;display:flex;align-items:center;
      justify-content:center;color:white;font-size:18px;
      border:2.5px solid white;
      box-shadow:0 2px 10px rgba(0,0,0,0.4);">🚌</div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
 
  // Stop icon
  const stopIcon = (color) => new L.DivIcon({
    html: `<div style="width:10px;height:10px;background:${color};
      border:2px solid white;border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    className: "",
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
 
  // When route changes, reset everything
  useEffect(() => {
    const newRoute = routes[routeKey];
    setRoute(newRoute);
    setPosition(newRoute.coords[0]);
    setPath([]);
    indexRef.current = 0;
    setNextStop(newRoute.stopNames[1] || "");
  }, [routeKey]);
 
  // Main movement loop
  useEffect(() => {
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
 
    moveIntervalRef.current = setInterval(() => {
      const coords = route.coords;
      const nextIndex = (indexRef.current + 1) % coords.length;
      const nextPos = coords[nextIndex];
 
      smoothMove(positionRef.current, nextPos);
 
      setPath(prev => {
        const updated = [...prev, nextPos].slice(-coords.length);
        return updated;
      });
 
      // ETA calculation
      const rawSec = Math.floor(Math.random() * 240) + 30;
      const m = Math.floor(rawSec / 60);
      const s = rawSec % 60;
      setEta(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
 
      // Simulated telemetry
      setSpeed(Math.floor(25 + Math.random() * 30));
      setSignal(Math.max(1, Math.min(4, Math.floor(Math.random() * 4) + 1)));
      setPassengers(prev => Math.max(5, Math.min(40, prev + Math.floor(Math.random() * 5) - 2)));
 
      // Next stop name
      const nextStopIdx = Math.min(nextIndex + 1, route.stopNames.length - 1);
      setNextStop(route.stopNames[nextStopIdx] || route.stopNames[route.stopNames.length - 1]);
 
      indexRef.current = nextIndex;
      if (nextIndex === 0) setPath([]);
    }, 3000);
 
    return () => {
      clearInterval(moveIntervalRef.current);
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [route]);
 
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: 280, background: "#161b22", borderRight: "1px solid #30363d",
        display: "flex", flexDirection: "column", zIndex: 1000, overflowY: "auto"
      }}>
        {/* Header */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #30363d" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 36, height: 36, background: "#1c2d42", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, border: "1px solid #2a4a6e"
            }}>🚌</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3" }}>
                KLE <span style={{ color: "#58a6ff" }}>Bus</span> Tracker
              </div>
              <div style={{ fontSize: 11, color: "#484f58" }}>Real-time campus transit</div>
            </div>
          </div>
          <StatusBar status={status} isOnline={isOnline} />
        </div>
 
        {/* Controls (route selector) */}
        <Controls
          setRouteKey={setRouteKey}
          routeKey={routeKey}
          routes={routes}
        />
 
        {/* ETA Box */}
        <ETABox
          eta={eta}
          routeKey={routeKey}
          route={route}
          speed={speed}
          signal={signal}
          nextStop={nextStop}
          passengers={passengers}
        />
      </div>
 
      {/* Map */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={position}
          zoom={14}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
 
          {/* Full route (dashed) */}
          <Polyline
            positions={route.coords}
            color={route.color}
            weight={3}
            opacity={0.35}
            dashArray="8,6"
          />
 
          {/* Travelled path (solid) */}
          <Polyline
            positions={path}
            color={route.color}
            weight={5}
            opacity={0.9}
          />
 
          {/* Stop markers */}
          {route.coords.map((coord, i) => (
            <Marker key={i} position={coord} icon={stopIcon(route.color)}>
              <Popup>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13 }}>
                  <strong>{route.stopNames[i] || `Stop ${i + 1}`}</strong><br />
                  <small style={{ color: "#888" }}>
                    {coord[0].toFixed(4)}, {coord[1].toFixed(4)}
                  </small>
                </div>
              </Popup>
            </Marker>
          ))}
 
          {/* Bus marker */}
          <Marker position={position} icon={busIcon}>
            <Popup>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13 }}>
                <strong>Bus — {routeKey}</strong><br />
                Speed: {speed} km/h<br />
                Next: {nextStop}<br />
                ETA: {eta}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
 
export default MapView;