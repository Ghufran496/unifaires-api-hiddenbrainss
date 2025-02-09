"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "education",

      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        collegeName: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        degree: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        fromYear: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        endYear: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      }
    );

    // Add foreign key constraint for 'userId'
    await queryInterface.addConstraint("education", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("education");
  },
};
