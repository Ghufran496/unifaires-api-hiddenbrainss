const { DataTypes, Model } = require("sequelize");
const sequelize = require("./../database");
const Chat = require("./chat");

class GroupChatUsers extends Model {
  // Helper method for defining associations
  static associate(models) {
    // Define associations here
  }
}

GroupChatUsers.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    chatId: {
      type: DataTypes.UUID,
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
    isGroupAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isGroupInitiator: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "groupchatusers",
    tableName: "groupchatusers",
  }
);

GroupChatUsers.belongsTo(Chat);
Chat.hasMany(GroupChatUsers);

GroupChatUsers.addHook("beforeValidate", async (groupChatUser, options) => {
  if (!groupChatUser.userId && !groupChatUser.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }

  if (groupChatUser.userId && groupChatUser.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = GroupChatUsers;
