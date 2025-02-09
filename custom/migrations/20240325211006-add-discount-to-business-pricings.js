"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("jobbusinesspricings", "discount", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn("jobbusinesspricings", "description", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("jobbusinesspricings", "discount");
    await queryInterface.removeColumn("jobbusinesspricings", "description");
  },
};
