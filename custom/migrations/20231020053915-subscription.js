"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'subscriptions' table
    await queryInterface.createTable("subscriptions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      subscriptionId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      platform: {
        type: Sequelize.STRING,
        allowNull: false,
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
      planId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "subscriptionplans",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      paymentDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      dueDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
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

    // Add foreign key constraints
    await queryInterface.addConstraint("subscriptions", {
      fields: ["userId"],
      type: "foreign key",
      name: "subscription_user",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("subscriptions", {
      fields: ["businessId"],
      type: "foreign key",
      name: "subscription_business",
      references: {
        table: "businesses",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("subscriptions", {
      fields: ["planId"],
      type: "foreign key",
      name: "subscription_plan",
      references: {
        table: "subscriptionplans",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Remove the 'subscriptions' table
    await queryInterface.dropTable("subscriptions");
  },
};
