"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./user");
class SubscriptionPlan extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

SubscriptionPlan.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    meta: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "subscriptionplans",
  }
);

module.exports = SubscriptionPlan;
