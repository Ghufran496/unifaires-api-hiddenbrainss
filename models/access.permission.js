"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");
class AccessPermission extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
AccessPermission.init(
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
      unique: true,
    },

    meta: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userLevel: {
      type: DataTypes.ENUM("user", "business", "admin"),
      allowNull: false,
      defaultValue: "business",
    },
  },

  {
    sequelize,
    modelName: "accesspermission",
    tableName: "accesspermissions",
  }
);

module.exports = AccessPermission;
