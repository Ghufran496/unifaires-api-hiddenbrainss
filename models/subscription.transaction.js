"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./user");
class SubscriptionTransaction extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

SubscriptionTransaction.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.UUID,
      allowNull: false,
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
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "subscriptiontransactions",
  }
);

SubscriptionTransaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

SubscriptionTransaction.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

SubscriptionTransaction.addHook(
  "beforeValidate",
  (SubscriptionTransaction, options) => {
    if (
      !SubscriptionTransaction.userId &&
      !SubscriptionTransaction.businessId
    ) {
      throw new Error("Either userId or businessId must be provided.");
    }
    if (SubscriptionTransaction.userId && SubscriptionTransaction.businessId) {
      throw new Error(
        "Both userId and businessId cannot be provided at the same time."
      );
    }
  }
);

module.exports = SubscriptionTransaction;
