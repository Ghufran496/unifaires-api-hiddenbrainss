"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("businesses", "firstname", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("businesses", "lastname", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("businesses", "othername", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.removeColumn("businesses", "fullname");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("businesses", "firstname");
    await queryInterface.removeColumn("businesses", "lastname");
    await queryInterface.removeColumn("businesses", "othername");
  },
};
