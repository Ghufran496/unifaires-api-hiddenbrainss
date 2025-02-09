"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("jobspaymenttypes", "months", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("jobspaymenttypes", "meta", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("jobspaymenttypes", "months");
    await queryInterface.removeColumn("jobspaymenttypes", "meta");
  },
};
