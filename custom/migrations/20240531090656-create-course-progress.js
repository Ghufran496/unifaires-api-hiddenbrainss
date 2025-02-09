"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable("courseprogress", {
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
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        courseId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "courses",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        sectionId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "sections",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        lectureId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "lectures",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        quizId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "quizzes",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        lectureContentId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "lecturecontents",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        lectureResourceId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "lectureresources",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        lectureArticleId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "lecturearticle",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        lectureQuizId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "lecturequiz",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        quizQuestionId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "quizquestions",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        progress: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0,
            max: 100,
          },
        },
        completed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      });
    } catch (err) {
      console.log("ths is the error", err);
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("courseprogress");
  },
};
