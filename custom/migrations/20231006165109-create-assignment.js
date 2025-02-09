// migrations/YYYYMMDDHHMMSS-create-assignments.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'assignments' table
    await queryInterface.createTable("assignments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      description: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      estimatedDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      instructionText: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      instructionUri: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      questions: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      sectionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "sections",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // Add the foreign key constraint
    await queryInterface.addConstraint("assignments", {
      fields: ["sectionId"],
      type: "foreign key",

      references: {
        table: "sections",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Remove the 'assignments' table
    await queryInterface.dropTable("assignments");
  },
};
