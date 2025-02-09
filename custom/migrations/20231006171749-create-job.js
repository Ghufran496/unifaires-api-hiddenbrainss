"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("jobs", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      jobsPaymentTypeId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "jobspaymenttypes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      referenceNo: {
        type: Sequelize.STRING,
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
      salary: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      organizationName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      aboutOrganization: {
        type: Sequelize.TEXT({ length: "long" }),
      },
      mediaUrl: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      details: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "jobcategories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      isUnifaires: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
      },
      contact: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: true,
      },
      isUnifairesUrl: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      levelOfEducation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      experienceLevel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      employmentBenefits: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      workingStyle: {
        type: DataTypes.ENUM("Remote", "Onsite", "Hybrid"),
        allowNull: true,
      },
      appDeadlineType: {
        type: DataTypes.ENUM("Anytime", "Fixed"),
        allowNull: true,
      },
      appDeadlineType: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      deadline: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "opened",
          "archive",
          "deactivate",
          "interviewing",
          "hired",
          "closed",
          "pending",
          "rejected"
        ),
        defaultValue: "opened",
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

    await queryInterface.addConstraint("jobs", {
      fields: ["jobsPaymentTypeId"],
      type: "foreign key",

      references: {
        table: "jobspaymenttypes",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("jobs", {
      fields: ["userId"],
      type: "foreign key",

      references: {
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("jobs", {
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
    await queryInterface.dropTable("jobs");
  },
};
