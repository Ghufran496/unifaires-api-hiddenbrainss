const express = require("express");
const router = express();

const { getCountries, getStateByCountry, getCityByState } = require("../controllers/countries");

router.get("/", getCountries);

router.get(
  "/states/:cn",
  getStateByCountry
);

router.get("/cities/:sn", getCityByState);

module.exports = router;
