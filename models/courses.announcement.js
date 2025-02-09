"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const Course = require("./course");

class CoursesAnnouncement extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
CoursesAnnouncement.init(
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
    text: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: false,
    },
    meta: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "coursesannouncement",
    tableName: "coursesannouncement",
  }
);

Course.hasMany(CoursesAnnouncement, {
  foreignKey: {
    allowNull: false,
  },
});

CoursesAnnouncement.belongsTo(Course);

module.exports = CoursesAnnouncement;
