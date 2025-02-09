"use strict";
const { Model, DataTypes } = require("sequelize");
const User = require("./user");
const sequelize = require("./../database");

class ProfessionalCertificate extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of DataTypes lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

ProfessionalCertificate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "professionalcertificate",
  }
);

ProfessionalCertificate.belongsTo(User);

User.hasMany(ProfessionalCertificate);

module.exports = ProfessionalCertificate;
