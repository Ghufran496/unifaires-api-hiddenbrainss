const { DataTypes, Model } = require("sequelize");
const sequelize = require("./../database");
const { Chats } = require("../models");

class ChatNotification extends Model {}

ChatNotification.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiverType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "chatsnotifications",
    tableName: "chatsnotifications",
  }
);

Chats.hasMany(ChatNotification);

ChatNotification.belongsTo(Chats);

module.exports = ChatNotification;
