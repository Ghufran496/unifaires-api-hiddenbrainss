const courseService = require("../../services/course/course.services");

const userServices = require("../../services/users.services");
const categoryServices = require("../../services/category.services");

const { useAsync } = require("../../core");
const { JParser, shuffleArray } = require("../../core/core.utils");
const { courses, combine } = require("../../core/core.alison");
const { getUserOrBusinessById } = require("../../helpers/user.helper"); // Import the utility function

const fs = require('fs/promises'); // Using fs.promises for asynchronous file reading
const DATA_PATH = "./data";

async function readJsonFile(filename) {
    const content = await fs.readFile(filename, 'utf-8');
    return JSON.parse(content);
  }
 
exports.getCountries = useAsync(async function (req, res, next) {
  try {
    
    const countriesData = require(DATA_PATH+'/countries.json');
    const countries = countriesData.map(country => ({ name: country.name, emoji: country.emoji,code: country.iso2 }));
    // check for filter
    if (countries) {
      return res.status(200).send(
        JParser("fetch successfully", true,
        countries
        )
      );
    } else {
      return res
        .status(200)
        .send(JParser("no country found", true, null));
    }
  } catch (error) {
    console.log("This is error", error);
    next(error);
  }
});


exports.getStateByCountry = useAsync(async function (req, res, next) {
  try {
    const {cn} = req.params;

    const stateData = require(DATA_PATH+'/states.json');
    const states = stateData.filter((state) => state.country_code == cn || state.country_name == cn);
    // check for filter
    if (states) {
      return res.status(200).send(
        JParser("fetch successfully", true,
        states
        )
      );
    } else {
      return res
        .status(200)
        .send(JParser("no country found", true, null));
    }
  } catch (error) {
    console.log("This is error", error);
    next(error);
  }
});


exports.getCityByState = useAsync(async function (req, res, next) {
  try {
    const {sn} = req.params;

    const stateData = require(DATA_PATH+'/states_cities.json');
    const states = stateData.filter((state) => state.name == sn || state.state_code == sn);
    // check for filter
    if (states) {
     const result = states.map((state)=> (state.cities))
     const cities = result.reduce((acc, current) => acc.concat(current), []);

      return res.status(200).send(
        JParser("fetch successfully", true,
        cities
        )
      );
    } else {
      return res
        .status(200)
        .send(JParser("no country found", true, null));
    }
  } catch (error) {
    console.log("This is error", error);
    next(error);
  }
}); 
