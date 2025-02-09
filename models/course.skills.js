"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const Course = require("./course");

class CourseSkills extends Model {}

CourseSkills.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    courseId: {
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
    modelName: "coursesskills",
    tableName: "coursesskills",
  }
);

module.exports = CourseSkills;
