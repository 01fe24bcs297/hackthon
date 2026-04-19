import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Controls from "./Controls";

// 🔥 STATIC ROUTES
const routes = {
  "KLE-Unkal": [
    [15.3687, 75.1231],
    [15.3678, 75.1220],
    [15.3668, 75.1212],
    [15.3657, 75.1203],
    [15.3645, 75.1194],
    [15.3630, 75.1175],
    [15.3605, 75.1150]
  ],
  "Unkal-City": [
    [15.3605, 75.1150],
    [15.3585, 75.1135],
    [15.3565, 75.1120],
    [15.3550, 75.1105],
    [15.3530, 75.1075]
  ]
};

function MapView() {
  const [routeKey, setRouteKey] = useState("KLE-Unkal");
  const [route, setRoute] = useState(routes["KLE-Unkal"]);
  const [position, setPosition] = useState(route[0]);
  const [path, setPath] = useState([]);
  const [status, setStatus] = useState("🟢 Demo Mode");
  const [eta, setEta] = useState("--");

  const positionRef = useRef(position);
  const animationRef = useRef(null);

  positionRef.current = position;

  // 🟢 SMOOTH MOVEMENT
  const smoothMove = (start, end) => {
    if (!start || !end) return;

    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    let steps = 40;
    let i = 0;

    animationRef.current = setInterval(() => {
      if (i >= steps) {
        clearInterval(animationRef.current);
        return;
      }

      const lat = start[0] + (end[0] - start[0]) * (i / steps);
      const lng = start[1] + (end[1] - start[1]) * (i / steps);

      setPosition([lat, lng]);
      i++;
    }, 60);
  };

  // 🚌 BUS ICON
  const icon = new L.DivIcon({
    html: `<div style="
      width:30px;height:30px;background:#007bff;
      border-radius:50%;display:flex;
      align-items:center;justify-content:center;
      color:white;">🚌</div>`,
    className: ""
  });

  // 🔁 CHANGE ROUTE
  useEffect(() => {
    const newRoute = routes[routeKey];
    setRoute(newRoute);
    setPosition(newRoute[0]);
    setPath([]);
  }, [routeKey]);

  // 🚀 DEMO MOVEMENT (NO BACKEND)
  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      const newPos = route[index];
      index = (index + 1) % route.length;

      smoothMove(positionRef.current, newPos);

      setPath(prev => [...prev, newPos].slice(-10));

      // Fake ETA
      const randomEta = Math.floor(Math.random() * 300);
      const m = Math.floor(randomEta / 60);
      const s = randomEta % 60;
      setEta(`${m} min ${s} sec`);

    }, 3000);

    return () => clearInterval(interval);
  }, [route]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Controls
        setRouteKey={setRouteKey}
        eta={eta}
        status={status}
        routeKey={routeKey}
        isOnline={true}
      />

      <MapContainer
        center={position}
        zoom={14}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={position} icon={icon} />

        {/* Route Path */}
        <Polyline positions={path} color="blue" weight={5} />
      </MapContainer>
    </div>
  );
}

export default MapView;
