"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("education", "isCurrent", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaulValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("education", "isCurrent");
  },
};
