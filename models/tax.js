"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
class Tax extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

Tax.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    country: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: false,
      unique: true,
    },

    tax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    meta: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "taxes",
  }
);

module.exports = Tax;
