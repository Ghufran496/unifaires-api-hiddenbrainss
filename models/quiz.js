"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");
const Section = require("./section");
class Quiz extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Quiz.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "quiz",
  }
);

Section.hasMany(Quiz, {
  foreignKey: {
    allowNull: false,
  },
});
Quiz.belongsTo(Section);

module.exports = Quiz;
