"use strict";

const { Model, DataTypes, Op } = require("sequelize");

const sequelize = require("./../database");

const User = require("./user");

const Business = require("./business");

class Contact extends Model {}

Contact.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    portfolioUrl: {
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

    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "contact",
  }
);

User.hasMany(Contact, { as: "userContacts" });

Contact.belongsTo(User, {
  foreignKey: "userId",
  as: "contactUser",
  allowNull: true,
});

Business.hasMany(Contact, { as: "businessContacts" });

Contact.belongsTo(Business, {
  foreignKey: "businessId",
  as: "contactBusiness",
  allowNull: true,
});

Contact.addHook("beforeCreate", async (contact, options) => {
  if (contact.isDefault) {
    contact._updateRelatedRecords = true;
  }
});

Contact.addHook("beforeValidate", (contact, options) => {
  if (!contact.userId && !contact.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (contact.userId && contact.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

Contact.addHook("afterValidate", async (contact, options) => {
  if (contact._updateRelatedRecords) {
    await Contact.update(
      { isDefault: false },
      {
        where: {
          [Op.or]: [
            { userId: contact.userId },
            { businessId: contact.businessId },
          ],
          id: { [Op.ne]: contact.id },
        },
      }
    );
  }
});

module.exports = Contact;
