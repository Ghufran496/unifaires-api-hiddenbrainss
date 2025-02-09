"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const Lecture = require("./lecture");

class LectureQuiz extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
LectureQuiz.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["multiple", "truthy", "essay"],
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "lecturequiz",
    tableName: "lecturequiz",
  }
);

Lecture.hasMany(LectureQuiz, {
  foreignKey: {
    allowNull: false,
  },
});

LectureQuiz.belongsTo(Lecture);

module.exports = LectureQuiz;
