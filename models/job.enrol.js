"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const { User, Business, Jobs } = require("./");
class JobsEnrol extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

JobsEnrol.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    jobUserStatus: {
      type: DataTypes.ENUM(
        "interviewing",
        "hiring",
        "cancelled",
        "closed",
        "pending",
        "accepted",
        "rejected"
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
    modelName: "jobenrols",
    tableName: "jobenrols",
  }
);

Jobs.hasMany(JobsEnrol, {
  foreignKey: {
    allowNull: false,
  },
});
JobsEnrol.belongsTo(Jobs);

JobsEnrol.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

JobsEnrol.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

JobsEnrol.addHook("beforeValidate", (JobsEnrol, options) => {
  if (!JobsEnrol.userId && !JobsEnrol.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (JobsEnrol.userId && JobsEnrol.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = JobsEnrol;
