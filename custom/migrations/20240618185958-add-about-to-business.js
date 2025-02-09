// migrations/YYYYMMDDHHMMSS-create-businesses.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("businesses", "about", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("businesses", "about");
  },
};
