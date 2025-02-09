"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const Lecture = require("./lecture");

class LectureArticle extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
LectureArticle.init(
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
    article: {
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
    modelName: "lecturearticle",
    tableName: "lecturearticle",
  }
);

Lecture.hasMany(LectureArticle, {
  foreignKey: {
    allowNull: false,
  },
});

LectureArticle.belongsTo(Lecture);

module.exports = LectureArticle;
