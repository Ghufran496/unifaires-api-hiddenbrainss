"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const Business = require("./business");

class BusinessCoursePayout extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

BusinessCoursePayout.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    businessId: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    businessPercentage: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isDecimal: true,
        min: 0,
        max: 100,
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "businesscoursepayouts",
    tableName: "businesscoursepayouts",
  }
);

BusinessCoursePayout.belongsTo(Business);

Business.hasMany(BusinessCoursePayout);

module.exports = BusinessCoursePayout;
