"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

// const User = require("./user");
// const Jobs = require("./jobs");

const { User, Business, Jobs } = require("./");
class JobWish extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

JobWish.init(
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

    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "jobswishes",
  }
);

Jobs.hasMany(JobWish);
JobWish.belongsTo(Jobs);

JobWish.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = JobWish;
