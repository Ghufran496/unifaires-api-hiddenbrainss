"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database"); // Ensure the correct path to your Sequelize instance

const { User, SubscriptionPlan, Business } = require("./");
class Subscription extends Model {
  static associate(models) {
    // Define associations here
  }
}

Subscription.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    subscriptionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "subscription",
  }
);

Subscription.belongsTo(SubscriptionPlan, {
  foreignKey: "planId",
});

Subscription.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Subscription.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

Subscription.addHook("beforeValidate", (subscription, options) => {
  if (options.isNewRecord) {
    if (!subscription.userId && !subscription.businessId) {
      throw new Error("Either userId or businessId must be provided.");
    }
    if (subscription.userId && subscription.businessId) {
      throw new Error(
        "Both userId and businessId cannot be provided at the same time."
      );
    }
  }
});

module.exports = Subscription;
