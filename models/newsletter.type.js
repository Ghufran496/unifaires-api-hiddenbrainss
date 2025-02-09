"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database"); // Adjust the path according to your project structure

class NewsletterType extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // Define association here
    // If there are associations to be made, you can add them here
  }
}

NewsletterType.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "NewsletterType",
    tableName: "newslettertypes",
  }
);

module.exports = NewsletterType;
