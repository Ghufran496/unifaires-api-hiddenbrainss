"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class SubscriptionCountryPricing extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
}

SubscriptionCountryPricing.init(
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
      unique: true,
    },
    countryISO: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "subscriptioncountrypricing",
    tableName: "subscriptioncountrypricing",
  }
);

module.exports = SubscriptionCountryPricing;
