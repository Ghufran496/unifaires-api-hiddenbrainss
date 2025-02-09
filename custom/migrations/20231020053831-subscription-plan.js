// migrations/YYYYMMDDHHMMSS-create-transactions.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'transactions' table
    await queryInterface.createTable("subscriptionplans", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      meta: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Remove the 'subscriptionplan' table
    await queryInterface.dropTable("subscriptionplans");
  },
};
