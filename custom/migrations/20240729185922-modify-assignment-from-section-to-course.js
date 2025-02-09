"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the sectionId column
    await queryInterface.removeColumn("assignments", "sectionId");

    // Add the courseId column
    await queryInterface.addColumn("assignments", "courseId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Add the foreign key constraint for courseId
    await queryInterface.addConstraint("assignments", {
      fields: ["courseId"],
      type: "foreign key",
      references: {
        table: "courses",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the courseId column
    await queryInterface.removeColumn("assignments", "courseId");

    // Add back the sectionId column
    await queryInterface.addColumn("assignments", "sectionId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "sections",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Add the foreign key constraint for sectionId
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
};
