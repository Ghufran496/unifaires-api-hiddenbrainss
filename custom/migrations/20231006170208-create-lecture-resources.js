"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("lectureresources", {
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
      mediaUri: {
        type: Sequelize.TEXT({ length: "long" }),
      },
      meta: {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: true,
      },
      lectureId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "lectures",
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

    await queryInterface.addConstraint("lectureresources", {
      fields: ["lectureId"],
      type: "foreign key",
      references: {
        table: "lectures",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("lectureresources");
  },
};
