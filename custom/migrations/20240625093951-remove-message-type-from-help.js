"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("helpschats", "messageType");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("helpschats", "messageType", {
      type: Sequelize.ENUM("business", "user"),
      allowNull: false,
      defaultValue: "user",
    });
  },
};
