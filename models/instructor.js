"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

const Course = require("./course");
class Instructor extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Instructor.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "instructor",
  }
);

Course.hasMany(Instructor, {
  foreignKey: {
    allowNull: false,
  },
});

Instructor.belongsTo(Course);

module.exports = Instructor;
