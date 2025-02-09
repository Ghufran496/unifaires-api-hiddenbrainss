const { DataTypes, Model } = require("sequelize");
const sequelize = require("./../database");

const Chat = require("./chat");

class ChatMessages extends Model {
  // Helper method for defining associations
  static associate(models) {
    // Define associations here
  }
}

ChatMessages.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    senderType: {
      type: DataTypes.ENUM,
      values: ["user", "business"],
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: false,
    },
    contentType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "text",
    },
    status: {
      type: DataTypes.ENUM,
      values: ["undelivered", "delivered", "read"],
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "chatmessages",
    tableName: "chatmessages",
  }
);

ChatMessages.belongsTo(Chat);

Chat.hasMany(ChatMessages);

module.exports = ChatMessages;
