"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("courses", "scholarshipUrl", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
    await queryInterface.addColumn("courses", "isScholarship", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn("courses", "externalUrl", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
    await queryInterface.addColumn("courses", "isExternal", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("courses", "externalUrl");
    await queryInterface.removeColumn("courses", "isExternal");
    await queryInterface.removeColumn("courses", "scholarshipUrl");
    await queryInterface.removeColumn("courses", "isScholarship");
  },
};
