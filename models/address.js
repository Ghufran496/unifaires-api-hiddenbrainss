"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

const User = require("./user");
const Business = require("./business");
class Address extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

Address.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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

    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "address",
  }
);

Address.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Address.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

Address.addHook("beforeValidate", (Address, options) => {
  if (!Address.userId && !Address.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (Address.userId && Address.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = Address;
