const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

const User = require("./user");
const Business = require("./business");

class VirtualAccounts extends Model {}

VirtualAccounts.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    accountNumber: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: false,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "virtualaccounts",
    tableName: "virtualaccounts",
  }
);

VirtualAccounts.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  allowNull: true,
});

VirtualAccounts.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
  allowNull: true,
});

VirtualAccounts.addHook("beforeValidate", (virtualAccount, options) => {
  if (options.isNewRecord) {
    if (!virtualAccount.userId && !virtualAccount.businessId) {
      throw new Error("Either userId or businessId must be provided.");
    }
    if (virtualAccount.userId && virtualAccount.businessId) {
      throw new Error(
        "Both userId and businessId cannot be provided at the same time."
      );
    }
  }
});

module.exports = VirtualAccounts;
