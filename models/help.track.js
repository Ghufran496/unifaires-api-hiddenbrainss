"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const { User, Help } = require(".");
class HelpTrack extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */

  static associate(models) {}
}

HelpTrack.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    assignToId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    assignById: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "assigned", "resolved", "disputed"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "helptrack",
    tableName: "helptracks",
  }
);

Help.hasMany(HelpTrack, {
  foreignKey: {
    allowNull: false,
  },
});

HelpTrack.belongsTo(Help);

HelpTrack.belongsTo(User, {
  foreignKey: "assignToId",
  as: "assignToUser",
});

HelpTrack.belongsTo(User, {
  foreignKey: "assignById",
  as: "assignByUser",
});

module.exports = HelpTrack;
