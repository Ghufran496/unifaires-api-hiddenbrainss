const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./user");
const Team = require("./team");
const Business = require("./business");

class TeamMembers extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

TeamMembers.init(
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
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    teamId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "teammembers",
  }
);

Team.hasMany(TeamMembers);
TeamMembers.belongsTo(Team);

TeamMembers.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

TeamMembers.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

TeamMembers.addHook("beforeValidate", (TeamMembers, options) => {
  if (!TeamMembers.userId && !TeamMembers.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (TeamMembers.userId && Course.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = TeamMembers;
