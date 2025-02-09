"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");
const { User } = require("../models");
class Mentorship extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of DataTypes lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Mentorship.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },

    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    othernames: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    currentJobTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    currentOrganization: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phonenumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mediaUrl: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: false,
    },

    skills: {
      type: DataTypes.JSON(),
      allowNull: false,
    },

    about: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "mentorships",
    tableName: "mentorships",
  }
);
// ----> I don't know what else broke here I 
// Mentorship.addHook("beforeValidate", async (mentorship, options) => {
//   if (!mentorship.userId && !mentorship.businessId) {
//     throw new Error("Either userId or businessId must be provided.");
//   }

//   if (mentorship.userId && mentorship.businessId) {
//     throw new Error(
//       "Both userId and businessId cannot be provided at the same time."
//     );
//   }
// });

module.exports = Mentorship;
