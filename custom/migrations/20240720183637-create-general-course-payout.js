"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("generalcoursepayouts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      country: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      businessPercentage: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
        validate: {
          isDecimal: true,
          min: 0,
          max: 100,
        },
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add an index to the country column
    await queryInterface.addIndex("generalcoursepayouts", ["country"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the index first
    await queryInterface.removeIndex("generalcoursepayouts", ["country"]);

    // Drop the table
    await queryInterface.dropTable("generalcoursepayouts");
  },
};
