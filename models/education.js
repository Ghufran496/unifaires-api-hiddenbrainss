"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");
const User = require("./user");

class Education extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

Education.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    collegeName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fromYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: false,
    },
    endYear: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "education",
  }
);

User.hasMany(Education);

Education.belongsTo(User, {
  foreignKey: "userId",
  allowNull: false,
});

module.exports = Education;
