require('dotenv').config();
const fs = require('fs');

// DATABASE CONFIGURATION
const DATABASE_LANG = 'mysql';
const DATABASE_NAME = process.env.DB_NAME;
const DATABASE_USER = process.env.DB_USER;
const DATABASE_PASS = process.env.DB_PASS;
const DATABASE_HOST = process.env.DB_HOST;
const DATABASE_PORT = process.env.DB_PORT;

module.exports = {
  development: {
    username: DATABASE_USER,
    password: DATABASE_PASS,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: DATABASE_LANG,
    dialectModule: require('mysql2'),

    dialectOptions: {
      bigNumberStrings: true,
    },
    logging: (query) => {
      // console.log(query);
    },
  },
  test: {
    username: DATABASE_USER,
    password: DATABASE_PASS,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: DATABASE_LANG,
    dialectOptions: {
      bigNumberStrings: true,
    },

    logging: (query) => {
      // console.log(query);
    },
  },
  production: {
    username: DATABASE_USER,
    password: DATABASE_PASS,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: 'mysql',
    dialectModule: require('mysql2'),

    dialectOptions: {
      bigNumberStrings: true,
    },
    logging: (query) => {
      // console.log(query);
    },
  },
};
