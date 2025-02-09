const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");
const { Help, User, Business } = require("./");

class HelpChat extends Model {
  static associate(models) {}
}

HelpChat.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    helpId: {
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
    agentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "text",
    },

    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },

      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "helpschats",
    tableName: "helpschats",
  }
);

HelpChat.belongsTo(Help, {
  foreignKey: "helpId",
});

HelpChat.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  allowNull: true,
});

HelpChat.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
  allowNull: true,
});

HelpChat.belongsTo(User, {
  foreignKey: "agentId",
  as: "agent",
});

HelpChat.addHook("beforeValidate", async (helpchats, options) => {
  if (helpchats.userId && helpchats.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = HelpChat;
