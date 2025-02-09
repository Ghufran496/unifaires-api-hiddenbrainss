"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const { User, Business } = require("../models");
const Course = require("./course");
class Transactions extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

Transactions.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "-",
    },
    paidFor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paidForId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRefundable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isRefunded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "transactions",
    tableName: "transactions",
  }
);

Transactions.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Transactions.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

Transactions.belongsTo(Course, {
  foreignKey: "paidForId",
  as: "course",
  constraints: false,
});

Transactions.addHook("beforeValidate", (Transactions, options) => {
  if (!Transactions.userId && !Transactions.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (Transactions.userId && Transactions.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = Transactions;
