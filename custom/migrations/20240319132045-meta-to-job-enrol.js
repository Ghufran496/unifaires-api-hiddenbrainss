"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns
    await queryInterface.addColumn("jobenrols", "meta", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("jobenrols", "meta");
  },
};
