"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = require("./user");
const Course = require("./course");
const Business = require("./business");

class CourseWish extends Model {}

CourseWish.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "coursewish",
  }
);

CourseWish.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

CourseWish.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

Course.hasMany(CourseWish, { foreignKey: { allowNull: false } });

CourseWish.belongsTo(Course);

CourseWish.addHook("beforeValidate", (courseWish, options) => {
  if (courseWish.isNewRecord) {
    if (!courseWish.userId && !courseWish.businessId) {
      throw new Error("Either userId or businessId must be provided.");
    }
    if (courseWish.userId && courseWish.businessId) {
      throw new Error(
        "Both userId and businessId cannot be provided at the same time."
      );
    }
  }
});

module.exports = CourseWish;
