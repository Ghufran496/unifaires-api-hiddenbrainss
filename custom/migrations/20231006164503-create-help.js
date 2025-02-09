// migrations/YYYYMMDDHHMMSS-create-helps.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'helps' table
    await queryInterface.createTable("helps", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      severity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      file: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: true,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "en",
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      businessId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "businesses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // Add foreign key constraint for 'userId'
    await queryInterface.addConstraint("helps", {
      fields: ["userId"],
      type: "foreign key",

      references: {
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("helps", {
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
    // Remove the 'helps' table
    await queryInterface.dropTable("helps");
  },
};
