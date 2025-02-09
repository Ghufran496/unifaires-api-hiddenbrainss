// migrations/YYYYMMDDHHMMSS-create-virtual-account.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'virtualaccounts' table
    await queryInterface.createTable(
      "virtualaccounts",

      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        accountNumber: {
          type: Sequelize.TEXT({ length: "long" }),
          allowNull: false,
        },
        bankName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        meta: {
          type: Sequelize.TEXT({ length: "long" }),
          allowNull: true,
        },
        status: {
          type: Sequelize.STRING,
          defaultValue: "active",
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        businessId: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        platform: {
          type: Sequelize.STRING,
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
      }
    );

    // Add foreign key constraint for 'userId'
    await queryInterface.addConstraint("virtualaccounts", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("virtualaccounts", {
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
    // Remove the 'virtualaccounts' table
    await queryInterface.dropTable("virtualaccounts");
  },
};
