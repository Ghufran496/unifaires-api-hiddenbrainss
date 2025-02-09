"use strict";
const { Model, DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../database");

class CategoriesAncestors extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
}
CategoriesAncestors.init(
  {
    categoryId: {
      type: DataTypes.UUID,
    },
    ancestorId: {
      type: DataTypes.UUID,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
  },

  {
    sequelize,
    modelName: "categoriesancestors",
  }
);

module.exports = CategoriesAncestors;
