"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");
class Language extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Language.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue("language", value.trim().toLowerCase());
      },
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "language",
  }
);

module.exports = Language;
