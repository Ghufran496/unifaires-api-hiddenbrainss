"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const { User, Business, AssociateTransactions } = require("../models");

// const User = require("./user");
// const AssociateTransactions = require("./associate.transaction");
// const Business = require("./business");

class AssociateUser extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

AssociateUser.init(
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
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    associateId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    voucher: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    startAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    endAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "associateuser",
    tableName: "associateusers",
  }
);

AssociateUser.belongsTo(User, {
  foreignKey: "associateId",
  as: "user",
});

AssociateUser.belongsTo(User, {
  foreignKey: "userId",
  as: "invitedUser",
});

AssociateUser.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
  allowNull: true,
});

AssociateUser.belongsTo(AssociateTransactions, {
  foreignKey: "transactionId",
  as: "transaction",
});

AssociateTransactions.hasMany(AssociateUser, {
  foreignKey: "transactionId",
});

AssociateUser.addHook("beforeValidate", (AssociateUser, options) => {
  if (!AssociateUser.userId && !AssociateUser.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (AssociateUser.userId && AssociateUser.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = AssociateUser;
