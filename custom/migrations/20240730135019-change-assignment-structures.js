"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Alter the 'assignments' table to make columns allow null
    await queryInterface.changeColumn("assignments", "description", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
    await queryInterface.changeColumn("assignments", "estimatedDuration", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn("assignments", "instructionText", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
    await queryInterface.changeColumn("assignments", "instructionUri", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
    await queryInterface.changeColumn("assignments", "questions", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Revert the changes made in the up method
    await queryInterface.changeColumn("assignments", "description", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: false,
    });
    await queryInterface.changeColumn("assignments", "estimatedDuration", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn("assignments", "instructionText", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: false,
    });
    await queryInterface.changeColumn("assignments", "instructionUri", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: false,
    });
    await queryInterface.changeColumn("assignments", "questions", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: false,
    });
  },
};
