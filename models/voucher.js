const sequelize = require("./../database");
const { DataTypes, Model } = require("sequelize");

const { User, Business } = require("./");

/**
 * Model extending sequelize model class
 */

class Voucher extends Model {}

Voucher.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    voucher: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },

    limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "voucher",
  }
);

Voucher.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Voucher.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

Voucher.addHook("beforeValidate", (Voucher, options) => {
  if (!Voucher.userId && !Voucher.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (Voucher.userId && Voucher.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = Voucher;
