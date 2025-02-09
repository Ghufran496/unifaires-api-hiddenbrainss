"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const { User, Funding } = require("./");

class FundingWishes extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

FundingWishes.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    fundingId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "fundingwishes",
    tableName: "fundingwishes",
  }
);

Funding.hasMany(FundingWishes);
FundingWishes.belongsTo(Funding);

FundingWishes.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = FundingWishes;
