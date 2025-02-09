"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const { Business } = require("./");

class InviteBusinessPricing extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
}
InviteBusinessPricing.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "invitebusinesspricings",
    tableName: "invitebusinesspricings",
  }
);

Business.hasMany(InviteBusinessPricing);
InviteBusinessPricing.belongsTo(Business);

module.exports = InviteBusinessPricing;
