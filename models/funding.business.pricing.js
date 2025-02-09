"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const { Business } = require("./");

class FundingBusinessPricing extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
}
FundingBusinessPricing.init(
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
    modelName: "fundingbusinesspricings",
    tableName: "fundingbusinesspricings",
  }
);

Business.hasMany(FundingBusinessPricing);
FundingBusinessPricing.belongsTo(Business);

module.exports = FundingBusinessPricing;
