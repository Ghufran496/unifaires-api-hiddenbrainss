"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const { User, Business, Funding } = require("./");
class FundingEnrol extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

FundingEnrol.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    fundingUserStatus: {
      type: DataTypes.ENUM(
        "pending",
        "interviewing",
        "accepted",
        "rejected",
        "cancelled",
        "funded"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telephoneAvailability: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    unifairesProfileLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availabilityFrom: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    meta: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "fundingenrols",
    tableName: "fundingenrols",
  }
);

Funding.hasMany(FundingEnrol, {
  foreignKey: {
    allowNull: false,
  },
});
FundingEnrol.belongsTo(Funding);

FundingEnrol.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

FundingEnrol.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

FundingEnrol.addHook("beforeValidate", (FundingEnrol, options) => {
  if (!FundingEnrol.userId && !FundingEnrol.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (FundingEnrol.userId && FundingEnrol.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = FundingEnrol;
