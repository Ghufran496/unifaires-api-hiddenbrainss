"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("helpschats", "type", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "text",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("helpschats", "type");
  },
};
