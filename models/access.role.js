const sequelize = require("../database");
const { DataTypes, Model } = require("sequelize");
class AccessRole extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

AccessRole.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      unique: {
        arg: true,
        msg: "access already exist.",
      },
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    userLevel: {
      type: DataTypes.ENUM("user", "business", "admin"),
      allowNull: false,
      defaultValue: "business",
    },

    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "accessrole",
    tableName: "accessroles",
  }
);

module.exports = AccessRole;
