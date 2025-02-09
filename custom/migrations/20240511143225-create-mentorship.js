// migrations/YYYYMMDDHHMMSS-create-mentorships.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'mentorships' table
    await queryInterface.createTable(
      "mentorships",

      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },

        firstname: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        lastname: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        othernames: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        currentJobTitle: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        currentOrganization: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        phonenumber: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        country: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        mediaUrl: {
          type: Sequelize.TEXT({ length: "long" }),
          allowNull: false,
        },

        skills: {
          type: Sequelize.JSON(),
          allowNull: false,
        },

        about: {
          type: Sequelize.TEXT({ length: "long" }),
          allowNull: false,
        },

        status: {
          type: Sequelize.ENUM("pending", "accepted", "rejected"),
          allowNull: false,
          defaultValue: "pending",
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
  },
  down: async (queryInterface, Sequelize) => {
    // Remove the 'mentorships' table
    await queryInterface.dropTable("mentorships");
  },
};
