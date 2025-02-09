// migrations/YYYYMMDDHHMMSS-create-industries.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'industries' table
    await queryInterface.createTable("industries", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
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
    // Remove the 'industries' table
    await queryInterface.dropTable("industries");
  },
};
