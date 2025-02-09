const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

const Skills = require("./skills");

const User = require("./user");

class UsersSkills extends Model {}

UsersSkills.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    skillId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  },
  {
    sequelize,
    modelName: "userskills",
    tableName: "userskills",
  }
);

UsersSkills.belongsTo(Skills, {
  foreignKey: "skillId",
});

/* leave the relationship to user model alone, i (Aka'aba Musa Akidi) have already take care of that. you will debug tiredly, if you don't hear word*/

module.exports = UsersSkills;
