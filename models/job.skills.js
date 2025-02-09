"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class JobsSkills extends Model {}

JobsSkills.init(
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
    skillId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "jobsskills",
    tableName: "jobsskills",
  }
);

module.exports = JobsSkills;
