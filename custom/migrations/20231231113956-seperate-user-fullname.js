"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "firstname", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("users", "lastname", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("users", "othername", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.removeColumn("users", "fullname");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "firstname");
    await queryInterface.removeColumn("users", "lastname");
    await queryInterface.removeColumn("users", "othername");
  },
};
