"use strict";
const { Model, DataTypes, Sequelize } = require("sequelize");
const sequelize = require("./../database");

class Skills extends Model {
  static associate(models) {
    // // Define association here
    // Skills.belongsTo(models.Skills, {
    //   as: "parent",
    //   foreignKey: "parentId",
    // });
    // Skills.hasMany(models.Skills, {
    //   as: "children",
    //   foreignKey: "parentId",
    // });
  }
}

Skills.init(
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
    modelName: "skills",
    tableName: "skills",
    hierarchy: true
  }
);

// Skills.isHierarchy({});

// add skills link to course throught here
module.exports = Skills;
