"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("subscriptionplans", "durationDays", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 30,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("subscriptionplans", "durationDays");
  },
};
