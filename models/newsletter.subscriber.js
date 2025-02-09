"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database"); // Adjust the path according to your project structure

class NewsLetterSubscriber extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // Define associations here
  }
}

NewsLetterSubscriber.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    sequelize,
    modelName: "NewsLetterSubscriber",
    tableName: "newslettersubscribers",
  }
);

module.exports = NewsLetterSubscriber;
