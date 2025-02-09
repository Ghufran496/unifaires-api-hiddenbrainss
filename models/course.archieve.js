"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const { User, Business, Course } = require("./");

class CourseArchieve extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

CourseArchieve.init(
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
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "coursearchives",
  }
);

CourseArchieve.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

CourseArchieve.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

Course.hasMany(CourseArchieve, {
  foreignKey: {
    allowNull: false,
  },
});

CourseArchieve.belongsTo(Course);

CourseArchieve.addHook("beforeValidate", (courseArchieve, options) => {
  if (courseArchieve.isNewRecord) {
    if (!courseArchieve.userId && !courseArchieve.businessId) {
      throw new Error("Either userId or businessId must be provided.");
    }
    if (courseArchieve.userId && courseArchieve.businessId) {
      throw new Error(
        "Both userId and businessId cannot be provided at the same time."
      );
    }
  }
});

module.exports = CourseArchieve;
