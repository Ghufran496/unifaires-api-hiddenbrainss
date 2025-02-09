const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

const User = require("./user");

class AdminSocials extends Model {}

AdminSocials.init(
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
  },
  {
    sequelize,
    modelName: "adminsocials",
    tableName: "adminsocials",
  }
);

User.hasMany(AdminSocials);

AdminSocials.belongsTo(User, {
  foreignKey: "userId",
  allowNull: true,
});

module.exports = AdminSocials;
