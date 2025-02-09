"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE `courses` ADD `approveUserId` VARCHAR(36) NULL DEFAULT NULL"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE `courses` ADD `approvedAt` DATETIME NULL DEFAULT NULL;"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE `jobs` ADD `approveUserId` VARCHAR(36) NULL DEFAULT NULL"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE `jobs` ADD `approvedAt` DATETIME NULL DEFAULT NULL;"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE `courses` DROP `approveUserId`;"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE `courses` DROP `approvedAt`;"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE `jobs` DROP `approveUserId`;"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE `jobs` DROP `approvedAt`;"
    );
  },
};
