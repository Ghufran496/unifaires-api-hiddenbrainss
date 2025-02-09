"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const { User, Business, Jobs } = require("./");

class JobsTracks extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

JobsTracks.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    jobUserStatus: {
      type: DataTypes.ENUM("interviewing", "hiring", "cancelled", "closed"),
      allowNull: false,
      defaultValue: "interviewing",
    },
  },
  {
    sequelize,
    modelName: "jobtracks",
  }
);

Jobs.hasMany(JobsTracks, {
  foreignKey: {
    allowNull: false,
  },
});

JobsTracks.belongsTo(Jobs);

JobsTracks.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

JobsTracks.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

JobsTracks.addHook("beforeValidate", (JobsTracks, options) => {
  if (!JobsTracks.userId && !JobsTracks.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (JobsTracks.userId && JobsTracks.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = JobsTracks;
