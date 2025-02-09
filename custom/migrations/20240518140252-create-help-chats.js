"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("helpschats", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      helpId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "helps",
          key: "id",
        },
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      businessId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "businesses",
          key: "id",
        },
      },
      agentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      messageType: {
        type: Sequelize.ENUM("business", "user"),
        allowNull: false,
        defaultValue: "user",
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    // Add an index on the foreign keys for better performance
    await queryInterface.addIndex("helpschats", ["helpId"]);
    await queryInterface.addIndex("helpschats", ["userId"]);
    await queryInterface.addIndex("helpschats", ["agentId"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("helpschats");
  },
};
