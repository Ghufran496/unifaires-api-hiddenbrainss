"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

class PurchasedCourse extends Model {
  static associate(models) {
    PurchasedCourse.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}

PurchasedCourse.init(
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PurchasedCourse",
    tableName: "purchased_courses",
  }
);

module.exports = PurchasedCourse;