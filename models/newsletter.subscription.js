"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");
const { NewsLetterSubscriber, NewsLetterType } = require("../models");

class NewsLetterSubscription extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
NewsLetterSubscription.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    subscriberId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    newsletterTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "NewsLetterSubscription",
    tableName: "newslettersubscriptions",
  }
);

NewsLetterSubscription.belongsTo(NewsLetterSubscriber, {
  foreignKey: "subscriberId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

NewsLetterSubscription.belongsTo(NewsLetterType, {
  foreignKey: "newsletterTypeId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = NewsLetterSubscription;
