"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("subscriptions", "status", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("subscriptions", "status", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
