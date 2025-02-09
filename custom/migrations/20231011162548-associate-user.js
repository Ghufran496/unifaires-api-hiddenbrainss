// migrations/YYYYMMDDHHMMSS-create-transactions.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'transactions' table
    await queryInterface.createTable("associateusers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      transactionId: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      businessId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      associateId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      voucher: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      startAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      endAt: {
        allowNull: false,
        type: Sequelize.DATE,
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

    // Add foreign key constraints for courseId, jobId, and userId

    await queryInterface.addConstraint("associateusers", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("associateusers", {
      fields: ["businessId"],
      type: "foreign key",
      references: {
        table: "businesses",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("associateusers", {
      fields: ["transactionId"],
      type: "foreign key",
      references: {
        table: "associatetransactions",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("associateusers", {
      fields: ["associateId"],
      type: "foreign key",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Remove the 'associateusers' table
    await queryInterface.dropTable("associateusers");
  },
};
