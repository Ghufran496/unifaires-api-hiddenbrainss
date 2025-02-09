"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const { User, Business, Role } = require("../models");

class AssociateTransactions extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

AssociateTransactions.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    modelName: "associatetransactions",
  }
);

AssociateTransactions.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

AssociateTransactions.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

AssociateTransactions.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});

AssociateTransactions.addHook(
  "beforeValidate",
  (AssociateTransactions, options) => {
    if (!AssociateTransactions.userId && !AssociateTransactions.businessId) {
      throw new Error("Either userId or businessId must be provided.");
    }
    if (AssociateTransactions.userId && AssociateTransactions.businessId) {
      throw new Error(
        "Both userId and businessId cannot be provided at the same time."
      );
    }
  }
);

module.exports = AssociateTransactions;
