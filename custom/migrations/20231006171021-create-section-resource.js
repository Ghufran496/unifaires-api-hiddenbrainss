"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sectionresources", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      lectureId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      mediaUri: {
        type: Sequelize.TEXT({ length: "long" }),
      },
      meta: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: true,
      },
      sectionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "sections",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("sectionresources");
  },
};
