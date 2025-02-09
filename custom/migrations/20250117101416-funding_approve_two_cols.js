"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE `fundings` ADD `approveUserId` VARCHAR(36) NULL DEFAULT NULL"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE `fundings` ADD `approvedAt` DATETIME NULL DEFAULT NULL;"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE `fundings` DROP `approveUserId`;"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE `fundings` DROP `approvedAt`;"
    );
  },
};
