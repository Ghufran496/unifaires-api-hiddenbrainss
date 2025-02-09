"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "fundings",

      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        referenceNo: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        size: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        country: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        state: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        city: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        zipcode: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        language: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        organizationName: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        aboutOrganization: {
          type: Sequelize.TEXT,
        },

        mediaUrl: {
          type: Sequelize.TEXT,
          allowNull: false,
        },

        details: {
          type: Sequelize.TEXT,
          allowNull: false,
        },

        isUnifaires: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },

        contact: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        externalUrl: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        deadline: {
          type: Sequelize.DATE,
          allowNull: true,
        },

        status: {
          type: Sequelize.ENUM(
            "active",
            "archive",
            "deactivate",
            "interviewing",
            "awarded",
            "closed",
            "pending"
          ),
          defaultValue: "pending",
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW'),
        },

        fundingcategoryId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "fundingcategories",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        fundingPaymentTypeId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "fundingpaymenttypes",
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
          onDelete: "SET NULL",
        },

        businessId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "businesses",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("fundings");
  },
};
