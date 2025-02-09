'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('jobs', 'workingStyle', {
      type: Sequelize.ENUM('Remote', 'Onsite', 'Hybrid'),
      allowNull: true,
    });

    const columns = await queryInterface.describeTable('jobs');
    if (!columns.appDeadlineType) {
      await queryInterface.addColumn('jobs', 'appDeadlineType', {
        type: Sequelize.ENUM('Anytime', 'Fixed'),
        allowNull: true,
        defaultValue: 'Anytime',
        after: 'workingStyle',
      });
    }

    if (!columns.deadlineEnd) {
      await queryInterface.addColumn('jobs', 'deadlineEnd', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        after: 'appDeadlineType',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('jobs', 'workingStyle', {
      type: Sequelize.ENUM('Remote', 'Onsite', 'Hybrid'),
      allowNull: false,
    });

    const columns = await queryInterface.describeTable('jobs');
    if (columns.appDeadlineType) {
      await queryInterface.removeColumn('jobs', 'appDeadlineType');
    }
    if (columns.deadlineEnd) {
      await queryInterface.removeColumn('jobs', 'deadlineEnd');
    }
  },
};
