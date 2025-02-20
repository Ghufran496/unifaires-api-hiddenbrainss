"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // Create the 'transactionDetails' table
    await queryInterface.createTable("transactionDetails", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users", // Ensure this matches the table name for the User model
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      transactionId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      transactionAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentStatus: {
        type: Sequelize.ENUM("pending", "success", "failed", "expired"),
        allowNull: false,
        defaultValue: "pending",
      },
      transactionType: {
        type: Sequelize.ENUM(
          "payfunds",
          "addfunds",
          "sendfunds",
          "transferfunds",
          "withdrawfunds"
        ),
        allowNull: false,
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
      billingAddress: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {
          streetAddress: "",
          city: "",
          stateProvince: "",
          postalCode: "",
          country: "",
        },
      },
    });

    // Add foreign key constraint for 'userId'
    await queryInterface.addConstraint("transactionDetails", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "users", // Ensure this matches the table name for the User model
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // Remove the 'transactionDetails' table
    await queryInterface.dropTable("transactionDetails");
  },
};
