"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const { User, Jobs, Business } = require("./");
class JobArchieve extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

JobArchieve.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },

    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "jobarchives",
  }
);

Jobs.hasMany(JobArchieve);

JobArchieve.belongsTo(Jobs);

JobArchieve.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

JobArchieve.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

JobArchieve.addHook("beforeValidate", (JobArchieve, options) => {
  if (!JobArchieve.userId && !JobArchieve.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (JobArchieve.userId && JobArchieve.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = JobArchieve;
