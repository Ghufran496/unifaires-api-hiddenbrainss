const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");
const User = require("./user");

class TransactionDetails extends Model {}

TransactionDetails.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    transactionAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "success", "failed", "expired"),
      allowNull: false,
      defaultValue: "pending",
    },
    transactionType: {
      type: DataTypes.ENUM(
        "payfunds",
        "addfunds",
        "sendfunds",
        "transferfunds",
        "withdrawfunds"
      ),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    billingAddress: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        streetAddress: "",
        city: "",
        stateProvince: "",
        postalCode: "",
        country: "",
      },
    },
  },
  {
    sequelize,
    modelName: "transactionDetails",
  }
);

TransactionDetails.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = TransactionDetails;
