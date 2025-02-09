"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const { User, Business } = require("./");
class Team extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

Team.init(
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
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "teams",
  }
);

Team.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Team.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

Team.addHook("beforeValidate", (Team, options) => {
  if (!Team.userId && !Team.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (Team.userId && Team.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = Team;
