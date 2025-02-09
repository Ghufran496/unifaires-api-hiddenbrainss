require("dotenv").config();

// DATABASE CONFIGURATION
const DATABASE_LANG = "mysql";
const DATABASE_NAME = process.env.DB_NAME;
const DATABASE_USER = process.env.DB_USER;
const DATABASE_PASS = process.env.DB_PASS;
const DATABASE_HOST = process.env.DB_HOST;
const DATABASE_PORT = process.env.DB_PORT;

const { Sequelize } = require("sequelize");
require("sequelize-hierarchy-next")(Sequelize);

/**
 *
 * @type {BelongsTo<Model, Model> | Model<any, any> | Sequelize | Transaction}
 */

const dbConn = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASS, {
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  dialect: DATABASE_LANG,
  dialectModule: require("mysql2"),
  dialectOptions: {
    bigNumberStrings: true,
  },
  logging: (e) => {
    // console.log(e);
  },
});

dbConn
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = dbConn;
