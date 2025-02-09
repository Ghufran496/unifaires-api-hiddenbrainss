"use strict";

const { QueryInterface } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE `courses` CHANGE `status` `status` ENUM('active','archive','deactivate','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'active';"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE `courses` CHANGE `status` `status` ENUM('active','archive','deactivate') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'active';"
    );
  },
};
