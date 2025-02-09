"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const { User, Business } = require("./");

class Invite extends Model {}

Invite.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined"),
      allowNull: false,
      defaultValue: "pending",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    ownersId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    ownerType: {
      type: DataTypes.ENUM("user", "business"),
      allowNull: false,
    },
    invitedUserType: {
      type: DataTypes.ENUM("user", "business"),
      allowNull: false,
    },
    permissionIds: {
      type: DataTypes.JSON(),
      allowNull: true,
    },
    roleIds: {
      type: DataTypes.JSON(),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "invite",
  }
);

Invite.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Invite.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

Invite.addHook("beforeValidate", async (invite, options) => {
  if (options.isNewRecord) {
    if (!invite.userId && !invite.businessId) {
      throw new Error("Either userId or businessId must be provided.");
    }

    if (invite.userId && invite.businessId) {
      throw new Error(
        "Both userId and businessId cannot be provided at the same time."
      );
    }
  }
});

module.exports = Invite;
