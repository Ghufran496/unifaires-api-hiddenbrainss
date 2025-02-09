"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const { Business } = require("./");

class CourseBusinessPricing extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
}
CourseBusinessPricing.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "coursebusinesspricings",
    tableName: "coursebusinesspricings",
  }
);

Business.hasMany(CourseBusinessPricing);
CourseBusinessPricing.belongsTo(Business);

module.exports = CourseBusinessPricing;
