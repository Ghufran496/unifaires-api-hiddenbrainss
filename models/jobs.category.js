"use strict";

const { Model, DataTypes, Sequelize } = require("sequelize");
const sequelize = require("./../database");

class JobCategory extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // Define association here
    JobCategory.belongsTo(models.JobCategory, {
      as: "parent",
      foreignKey: "parentId",
    });
    JobCategory.hasMany(models.JobCategory, {
      as: "children",
      foreignKey: "parentId",
    });
    // Add associations for JobCategoryAncestor
    JobCategory.hasMany(models.JobCategoryAncestor, {
      as: "ancestors",
      foreignKey: "jobcategoriesId",
    });

  }
}
JobCategory.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },

    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    modelName: "jobcategories",
    tableName: "jobcategories",
    hierarchy: true
  }
);

// Adding hierarchy methods
// JobCategory.isHierarchy({});

module.exports = JobCategory;
