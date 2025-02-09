"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("chatmessages", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      senderId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      senderType: {
        type: Sequelize.ENUM("user", "business"),
        allowNull: true,
      },
      content: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      contentType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("undelivered", "delivered", "read"),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      chatId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "chats",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("chatmessages");
  },
};
