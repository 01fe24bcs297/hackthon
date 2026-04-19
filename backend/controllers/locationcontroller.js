const axios = require("axios");
const { saveLocation, getLatestLocation } = require('../models/locationstore');
const { addToBuffer, flushBuffer } = require('../utils/buffer');

// 🔥 store previous location globally
let prevLocation = null;


// ✅ ML FUNCTION (ETA prediction)
async function getETA(distance, speed) {
  try {
    const res = await axios.post("http://localhost:6000/predict", {
      distance,
      speed,
      hour: new Date().getHours()
    });

    return res.data.eta;
  } catch (err) {
    console.log("ML error:", err.message);
    return 0;
  }
}


// ✅ POST /location
exports.receiveLocation = (req, res) => {
  const { lat, lng, timestamp, networkStatus } = req.body;

  const data = { lat, lng, timestamp, networkStatus };

  // buffer if weak network
  if (networkStatus === "low") {
    addToBuffer(data);
    return res.json({ message: "Stored in buffer (low network)" });
  }

  // save directly
  saveLocation(data);

  // flush buffered data
  const buffered = flushBuffer();
  buffered.forEach(saveLocation);

  res.json({ message: "Location saved successfully" });
};


// ✅ GET /location (FIXED ETA LOGIC)
exports.getLatest = async (req, res) => {
  const latest = getLatestLocation();

  if (!latest) {
    return res.json({ message: "No data yet" });
  }

  let distance = 0.5; // default km
  let speed = 20;     // default km/h

  if (prevLocation && prevLocation.timestamp !== latest.timestamp) {

    const dLat = latest.lat - prevLocation.lat;
    const dLng = latest.lng - prevLocation.lng;

    let rawDistance = Math.sqrt(dLat * dLat + dLng * dLng) * 111;

    const timeDiff = (latest.timestamp - prevLocation.timestamp) / 1000;

    // 🔥 ignore tiny GPS noise
    if (rawDistance > 0.01 && timeDiff > 1) {

      distance = rawDistance;

      let calculatedSpeed = (distance / timeDiff) * 3600;

      // 🔥 clamp speed (realistic)
      if (calculatedSpeed > 60) calculatedSpeed = 60;
      if (calculatedSpeed < 5) calculatedSpeed = 5;

      speed = calculatedSpeed;
    }
  }

  // update previous
  prevLocation = latest;

  let eta = await getETA(distance, speed);

  // 🔥 FIX: dynamic fallback (NOT constant 300)
  if (!eta || eta === 0) {
    eta = Math.floor((distance / speed) * 3600);
  }

  res.json({
    lat: latest.lat,
    lng: latest.lng,
    timestamp: latest.timestamp,
    networkStatus: latest.networkStatus,
    eta: eta
  });
};