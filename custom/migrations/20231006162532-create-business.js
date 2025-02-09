// migrations/YYYYMMDDHHMMSS-create-businesses.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'businesses' table
    await queryInterface.createTable("businesses", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      companySize: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      apiKey: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      whoIs: {
        type: Sequelize.UUID,
        defaultValue: 0,
      },
      isEmailVerify: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      roleId: {
        type: Sequelize.UUID, // Foreign key for the role
        allowNull: false,
        defaultValue: 1,
        references: {
          model: "roles", // This references the 'roles' table
          key: "id", // This references the 'id' column in the 'roles' table
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

    // Add the foreign key constraint
    await queryInterface.addConstraint("businesses", {
      fields: ["roleId"],
      type: "foreign key",

      references: {
        table: "roles",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Remove the 'businesses' table
    await queryInterface.dropTable("businesses");
  },
};
