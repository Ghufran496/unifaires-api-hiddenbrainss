"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const { Transactions } = require("./");

class Refund extends Model {}

Refund.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "transactions",
        key: "id",
      },
    },
    refundId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "refund",
    tableName: "refunds",
  }
);

Refund.belongsTo(Transactions, {
  foreignKey: "transactionId",
});

Transactions.hasMany(Refund, {
  foreignKey: "transactionId",
});

module.exports = Refund;
