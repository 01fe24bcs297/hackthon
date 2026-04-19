// Temporary buffer when network fails

let buffer = [];

const addToBuffer = (data) => {
  buffer.push(data);
};

const flushBuffer = () => {
  const data = [...buffer];
  buffer = [];
  return data;
};

module.exports = { addToBuffer, flushBuffer };