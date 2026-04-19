import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Controls from "./Controls";

// 🔥 OSRM ROUTE (REAL ROAD PATH)
const getRoadRoute = async (points) => {
  if (points.length < 2) return [];

  const coords = points.map(p => `${p[1]},${p[0]}`).join(";");

  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
    );

    const data = await res.json();

    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map(coord => [
        coord[1],
        coord[0]
      ]);
    }
  } catch (err) {
    console.log("OSRM ERROR:", err);
  }

  return [];
};

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
  const [cleanRoute, setCleanRoute] = useState([]);

  const [status, setStatus] = useState("Loading...");
  const [eta, setEta] = useState("--");

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const positionRef = useRef(position);
  const animationRef = useRef(null);
  const routeRequestRef = useRef(0);

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
    setCleanRoute([]);
  }, [routeKey]);

  // 🌐 NETWORK DETECTION
  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  // 🚀 SEND DATA
  useEffect(() => {
    let timeout;
    let index = 0;

    const send = async () => {
      const current = route[index];
      index = (index + 1) % route.length;

      try {
        await fetch("http://127.0.0.1:5000/api/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: current[0],
            lng: current[1],
            timestamp: Date.now(),
            networkStatus: isOnline ? "good" : "low"
          })
        });
      } catch (err) {
        console.log("POST ERROR:", err);
      }

      timeout = setTimeout(send, 3000);
    };

    send();
    return () => clearTimeout(timeout);
  }, [route, isOnline]);

  // 🔥 CLEAN ROUTE UPDATE
  const updateCleanRoute = async (points) => {
    const requestId = ++routeRequestRef.current;

    const route = await getRoadRoute(points);

    if (requestId !== routeRequestRef.current) return;

    if (route.length > 0) {
      setCleanRoute(route);
    }
  };

  // 🚀 FETCH DATA (DYNAMIC SPEED)
  useEffect(() => {
    let interval;

    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/location");
        const data = await res.json();

        if (!data.lat || !data.lng) {
          setStatus("🟡 Waiting...");
          return;
        }

        const newPos = [data.lat, data.lng];

        smoothMove(positionRef.current, newPos);

        setPath(prev => {
          const updated = [...prev, newPos];
          const trimmed = updated.slice(-6);

          if (trimmed.length >= 3) {
            updateCleanRoute(trimmed);
          }

          return trimmed;
        });

        setStatus(
          data.networkStatus === "low"
            ? "🟡 Weak Network"
            : "🟢 Live Tracking"
        );

        if (data.eta !== undefined) {
          const m = Math.floor(data.eta / 60);
          const s = data.eta % 60;
          setEta(`${m} min ${s} sec`);
        }

      } catch (err) {
        console.log("FETCH ERROR:", err);
        setStatus("🔴Server Offline");
      }
    };

    const delay = isOnline ? 3000 : 8000;
    interval = setInterval(fetchData, delay);

    return () => clearInterval(interval);
  }, [isOnline]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Controls
        setRouteKey={setRouteKey}
        eta={eta}
        status={status}
        routeKey={routeKey}
        isOnline={isOnline}
      />

      <MapContainer
        center={position}
        zoom={14}
        style={{ height: "100%" }}
        whenCreated={(map) => {
          map.flyTo(position, 14);
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={icon} />

        {/* ✅ ONLY ONE CLEAN ROUTE */}
        <Polyline positions={cleanRoute} color="blue" weight={5} />
      </MapContainer>
    </div>
  );
}

export default MapView;