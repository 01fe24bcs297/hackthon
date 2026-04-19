const express = require('express');
const router = express.Router();

const {
  receiveLocation,
  getLatest
} = require('../controllers/locationcontroller');

router.post("/", receiveLocation);
router.get("/", getLatest);

module.exports = router;