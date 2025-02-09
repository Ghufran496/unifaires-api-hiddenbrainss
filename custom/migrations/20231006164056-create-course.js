// migrations/YYYYMMDDHHMMSS-create-courses.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'courses' table
    await queryInterface.createTable("courses", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      meta: {
        type: Sequelize.TEXT({ length: "long" }),
      },
      description: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      organizationName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      aboutOrganization: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      scope: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      requirement: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      target: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      lang: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      level: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },

      welcomeMessage: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      congratulationMessage: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("active", "archive", "deactivate"),
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
      categoryId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      subtitleLanguage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      programStartDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      applicationFees: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      isAssociateFree: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      programType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      studyPace: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      studyMode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      programRanking: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      applicationDeadline: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      levelsOfEducation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      qualificationType: {
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
    });

    // Add foreign key constraint for 'userId'
    await queryInterface.addConstraint("courses", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("courses", {
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
    // Remove the 'courses' table
    await queryInterface.dropTable("courses");
  },
};
