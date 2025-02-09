// migrations/YYYYMMDDHHMMSS-create-coupons.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'coupons' table
    await queryInterface.createTable(
      "coupons",

      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },

        code: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        discount: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        expirationDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM("active", "expired"),
          allowNull: false,
          defaultValue: "active",
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    // Remove the 'coupons' table
    await queryInterface.dropTable("coupons");
  },
};
