"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");
class Permission extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    meta: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
  },

  {
    sequelize,
    modelName: "permission",
  }
);

module.exports = Permission;
