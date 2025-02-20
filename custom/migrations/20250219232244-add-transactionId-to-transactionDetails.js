'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('transactionDetails', 'transactionId', {
      type: Sequelize.STRING,
      allowNull: true, // or false, depending on your requirements
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('transactionDetails', 'transactionId');
  }
};
