// migrations/YYYYMMDDHHMMSS-create-transactions.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'transactions' table
    await queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      paymentId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      paidFor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      paidForId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      courseId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "courses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      jobId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "jobs",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("transactions", {
      fields: ["courseId"],
      type: "foreign key",
      references: {
        table: "courses",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("transactions", {
      fields: ["jobId"],
      type: "foreign key",
      references: {
        table: "jobs",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("transactions", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("transactions", {
      fields: ["businessId"],
      type: "foreign key",
      references: {
        table: "businesses",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Remove the 'transactions' table
    await queryInterface.dropTable("transactions");
  },
};
