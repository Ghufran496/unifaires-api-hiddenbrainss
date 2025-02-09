const { DataTypes, Model } = require("sequelize");
const sequelize = require("./../database");

const User = require("./user");
const Business = require("./business");

class Chat extends Model {
  static associate(models) {}
}

Chat.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isGroupChat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    senderType: {
      type: DataTypes.ENUM,
      values: ["user", "business"],
      allowNull: true,
    },
    receiverType: {
      type: DataTypes.ENUM,
      values: ["user", "business"],
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "chat",
  }
);

Chat.belongsTo(User, { foreignKey: "receiverId", as: "userReceiver" });

Chat.belongsTo(User, { foreignKey: "senderId", as: "userSender" });

Chat.belongsTo(Business, { foreignKey: "receiverId", as: "businessReceiver" });

Chat.belongsTo(Business, { foreignKey: "senderId", as: "businessSender" });

module.exports = Chat;
