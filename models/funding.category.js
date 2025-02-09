"use strict";

const { Model, DataTypes, Sequelize } = require("sequelize");
const sequelize = require("./../database");

class FundingCategory extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // Define association here
    FundingCategory.belongsTo(models.FundingCategory, {
      as: "parent",
      foreignKey: "parentId",
    });
    FundingCategory.hasMany(models.FundingCategory, {
      as: "children",
      foreignKey: "parentId",
    });
  }
}
FundingCategory.init(
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
  },
  {
    sequelize,
    modelName: "fundingcategories",
    tableName: "fundingcategories",
    hierarchy: true
  }
);

// Adding hierarchy methods
// FundingCategory.isHierarchy({});

module.exports = FundingCategory;
