"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("businesscoursepayouts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      businessId: {
        allowNull: false,
        type: Sequelize.UUID,
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

    await queryInterface.addConstraint("businesscoursepayouts", {
      fields: ["businessId"],
      type: "foreign key",
      references: {
        table: "businesses",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("businesscoursepayouts");
  },
};
