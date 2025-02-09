"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

const Course = require("./course");
class Assignment extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
}
Assignment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estimatedDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    instructionText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructionUri: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    questions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "assignment",
  }
);

Course.hasMany(Assignment, {
  foreignKey: {
    allowNull: false,
  },
});
Assignment.belongsTo(Course);

module.exports = Assignment;
