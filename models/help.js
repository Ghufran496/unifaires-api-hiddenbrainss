"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

// const User = require("./user");
const { User, Business } = require("./");
class Help extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Help.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },

    ticketId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      allowNull: false,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    businessId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "-",
    },

    severity: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    file: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "en",
    },

    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },

      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("pending", "assigned", "resolved", "disputed"),
      allowNull: false,
      defaultValue: "pending",
    },
  },

  {
    sequelize,
    modelName: "helps",
    tableName: "helps",
  }
);

Help.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Help.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

module.exports = Help;
