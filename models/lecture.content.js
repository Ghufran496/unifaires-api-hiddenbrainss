"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const Lecture = require("./lecture");

class LectureContent extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
LectureContent.init(
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
    mediaUri: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
    meta: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "lecturecontent",
  }
);

Lecture.hasMany(LectureContent, {
  foreignKey: {
    allowNull: false,
  },
});

LectureContent.belongsTo(Lecture);

module.exports = LectureContent;
