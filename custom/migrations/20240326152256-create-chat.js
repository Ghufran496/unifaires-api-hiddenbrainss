"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("chats", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isGroupChat: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      senderId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      receiverId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      senderType: {
        type: Sequelize.ENUM("user", "business"),
        allowNull: true,
      },
      receiverType: {
        type: Sequelize.ENUM("user", "business"),
        allowNull: true,
      },
      imageUrl: {
        type: Sequelize.TEXT({ length: "long" }),
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("chats");
  },
};
