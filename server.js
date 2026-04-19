const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const locationRoutes = require("./routes/locationroutes");

// routes
app.use("/api/location", locationRoutes);

// ✅ ADD THIS
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});