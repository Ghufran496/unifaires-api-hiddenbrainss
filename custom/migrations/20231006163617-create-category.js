// migrations/YYYYMMDDHHMMSS-create-categories.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'categories' table
    await queryInterface.createTable("categories", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      parentId: {
        type: Sequelize.UUID,
      },
      hierarchyLevel: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Remove the 'categories' table
    await queryInterface.dropTable("categories");
  },
};
