"use strict";

const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

class JobCategoryAncestor extends Model {
  /**
   * Helper method for defining associations.
   */
  static associate(models) {
    // Associate with JobCategory
    JobCategoryAncestor.belongsTo(models.JobCategory, {
      as: "jobCategory",
      foreignKey: "jobcategoriesId",
    });
  }
}

JobCategoryAncestor.init(
  {
    jobcategoriesId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    ancestorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "JobCategoryAncestor",
    tableName: "jobcategoriesancestors",
    timestamps: false, // Assuming this table doesn’t need timestamps
  }
);

module.exports = JobCategoryAncestor;
