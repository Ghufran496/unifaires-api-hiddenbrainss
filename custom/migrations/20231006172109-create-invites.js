"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "invites",

      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },

        text: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        token: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "pending",
        },

        userId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        businessId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "businesses",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        ownersId: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        ownerType: {
          type: Sequelize.ENUM("user", "business"),
          allowNull: true,
        },
        invitedUserType: {
          type: Sequelize.ENUM("user", "business"),
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("NOW"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("NOW"),
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("invites");
  },
};
