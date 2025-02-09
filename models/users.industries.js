const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

const Industry = require("./industry");

class UsersIndustries extends Model {}

UsersIndustries.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    businessId: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    industryId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  },
  {
    sequelize,
    modelName: "usersindustries",
    tableName: "usersindustries",
  }
);

UsersIndustries.belongsTo(Industry, {
  foreignKey: "industryId",
});

UsersIndustries.addHook("beforeValidate", async (userIndustry, options) => {
  if (!userIndustry.userId && !userIndustry.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }

  if (userIndustry.userId && userIndustry.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = UsersIndustries;
