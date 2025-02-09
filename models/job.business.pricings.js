"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const { Business } = require("./");

class JobBusinessPricing extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
}
JobBusinessPricing.init(
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
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "jobbusinesspricings",
    tableName: "jobbusinesspricings",
  }
);

Business.hasMany(JobBusinessPricing);
JobBusinessPricing.belongsTo(Business);

module.exports = JobBusinessPricing;
