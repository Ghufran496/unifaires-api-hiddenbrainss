"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");
const Course = require("./course");
class Test extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
}

Test.init(
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
      allowNull: false,
    },
    minumumScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "tests",
  }
);

Course.hasMany(Test, {
  foreignKey: {
    allowNull: false,
  },
});
Test.belongsTo(Course);

module.exports = Test;
