"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("invites", "roleIds", {
      type: Sequelize.JSON(),
      allowNull: true,
    });
    await queryInterface.addColumn("invites", "permissionIds", {
      type: Sequelize.JSON(),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("invites", "roleIds");
    await queryInterface.removeColumn("invites", "permissionIds");
  },
};
