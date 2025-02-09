// onlineUser.js

const { DataTypes, Model } = require("sequelize");
const sequelize = require("./../database");

class OnlineUser extends Model {}

OnlineUser.init(
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
    businessId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    socketId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "onlineusers",
    tableName: "onlineusers",
  }
);

module.exports = OnlineUser;
