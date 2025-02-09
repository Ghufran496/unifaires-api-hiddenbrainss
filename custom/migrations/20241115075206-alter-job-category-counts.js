'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add `jobCount` column if it doesn't already exist
    const tableInfo = await queryInterface.describeTable('jobcategories');
    if (!tableInfo.jobCount) {
      await queryInterface.addColumn('jobcategories', 'jobCount', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        after: 'updatedAt', // MySQL specific: places column after `updatedAt`
      });
    }

    // Add `totalJobCount` column if it doesn't already exist
    if (!tableInfo.totalJobCount) {
      await queryInterface.addColumn('jobcategories', 'totalJobCount', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        after: 'jobCount', // MySQL specific: places column after `jobCount`
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove `jobCount` column if it exists
    const tableInfo = await queryInterface.describeTable('jobcategories');
    if (tableInfo.jobCount) {
      await queryInterface.removeColumn('jobcategories', 'jobCount');
    }

    // Remove `totalJobCount` column if it exists
    if (tableInfo.totalJobCount) {
      await queryInterface.removeColumn('jobcategories', 'totalJobCount');
    }
  }
};
