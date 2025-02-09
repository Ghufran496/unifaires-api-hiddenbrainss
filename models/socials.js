const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

// const { User, Business } = require("./index");

const User = require("./user");
const Business = require("./business");

class Social extends Model {}

Social.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT({ length: "long" }),
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
  },
  {
    sequelize,
    modelName: "social",
  }
);

User.hasMany(Social, { as: "userSocials" });

Social.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  allowNull: true,
});

Business.hasMany(Social, { as: "businessSocials" });

Social.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
  allowNull: true,
});

Social.addHook("beforeValidate", (social, options) => {
  if (social.isNewRecord) {
    if (!social.userId && !social.businessId) {
      throw new Error("Either userId or businessId must be provided.");
    }
    if (social.userId && social.businessId) {
      throw new Error(
        "Both userId and businessId cannot be provided at the same time."
      );
    }
  }
});

module.exports = Social;
