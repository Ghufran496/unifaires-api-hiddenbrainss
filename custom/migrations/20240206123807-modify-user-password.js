"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "password");
    await queryInterface.addColumn("users", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
