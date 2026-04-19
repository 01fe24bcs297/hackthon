// Simple in-memory storage (hackathon friendly)

let locations = [];

const saveLocation = (data) => {
  locations.push(data);
};

const getLatestLocation = () => {
  return locations[locations.length - 1];
};

const getAllLocations = () => {
  return locations;
};

module.exports = { saveLocation, getLatestLocation, getAllLocations };
