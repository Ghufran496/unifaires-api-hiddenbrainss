"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const { Transactions } = require("./");

class Earnings extends Model {}

Earnings.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    ownerType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    transactionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isSent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "earnings",
    tableName: "earnings",
  }
);

Earnings.belongsTo(Transactions, {
  foreignKey: "transactionId",
});

Transactions.hasMany(Earnings);

module.exports = Earnings;
