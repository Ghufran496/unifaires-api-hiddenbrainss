"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = require("./user");

class CourseWish extends Model {}

CourseWish.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licenseClass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "drivinglicense",
  }
);

CourseWish.belongsTo(User);

module.exports = CourseWish;
