"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const Quiz = require("./quiz");
class QuizQuestion extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
QuizQuestion.init(
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
    modelName: "quizquestion",
  }
);

Quiz.hasMany(QuizQuestion, {
  foreignKey: {
    allowNull: false,
  },
});

QuizQuestion.belongsTo(Quiz);

module.exports = QuizQuestion;
