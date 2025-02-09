// config.js
const axios = require("axios");
const Flutterwave = require("flutterwave-node-v3");

// Base URL
const BASE_API_URL = `https://api.flutterwave.com/v3/`;

// Function to get Axios configuration with dynamic URL path
const flwAxiosConfig = (urlPath) => ({
  method: "GET",
  url: `${BASE_API_URL}${urlPath}`,
  headers: {
    Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_TEST_KEY}`,
  },
});

// Flutterwave configuration
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_TEST_KEY,
  process.env.FLUTTERWAVE_SECRET_TEST_KEY
);

module.exports = { flwAxiosConfig, flw };
