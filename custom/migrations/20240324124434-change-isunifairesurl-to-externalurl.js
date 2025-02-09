"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("jobs", "isUnifairesUrl", "externalUrl");

    await queryInterface.changeColumn("jobs", "externalUrl", {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("jobs", "externalUrl", "isUnifairesUrl");
  },
};
