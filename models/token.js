"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");
const User = require("./user");
const Business = require("./business");

class Token extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {}
}
Token.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "token",
  }
);

Token.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Token.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

Token.addHook("beforeValidate", (Token, options) => {
  if (!Token.userId && !Token.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (Token.userId && Token.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = Token;
