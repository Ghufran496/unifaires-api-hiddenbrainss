const sequelize = require("../database");
const { DataTypes, Model } = require("sequelize");
const { AccessPermission, AccessRole } = require("../models");
class AccessRolePermissions extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

AccessRolePermissions.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    accessRoleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    accessPermissionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "accessrolepermissions",
    tableName: "accessrolepermissions",
  }
);

AccessRolePermissions.belongsTo(AccessRole, {
  foreignKey: "accessRoleId",
});
AccessRole.hasMany(AccessRolePermissions);

AccessRolePermissions.belongsTo(AccessPermission, {
  foreignKey: "accessPermissionId",
});
AccessPermission.hasMany(AccessRolePermissions);

module.exports = AccessRolePermissions;
