"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable("fundings");
    if (!tableDescription.slug) {
      await queryInterface.addColumn("fundings", "slug", {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable("fundings");
    if (tableDescription.slug) {
      await queryInterface.removeColumn("fundings", "slug");
    }
  },
};
