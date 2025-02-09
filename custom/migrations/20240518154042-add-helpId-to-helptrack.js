"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the columns already exist before adding them
    const helpIdExist = await queryInterface
      .describeTable("helptracks")
      .then((tableDefinition) => "helpId" in tableDefinition);

    // Add the columns only if they don't already exist
    if (!helpIdExist) {
      await queryInterface.addColumn("helptracks", "helpId", {
        type: Sequelize.UUID,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Check if the columns exist before removing them
    const helpIdExist = await queryInterface
      .describeTable("helptracks")
      .then((tableDefinition) => "helpId" in tableDefinition);

    const jobDescriptionColumnExists = await queryInterface
      .describeTable("jobbusinesspricings")
      .then((tableDefinition) => "helpId" in tableDefinition);

    // Remove the columns only if they exist
    if (helpIdExist) {
      await queryInterface.removeColumn("helptracks", "helpId");
    }

    if (jobDescriptionColumnExists) {
      await queryInterface.removeColumn("jobbusinesspricings", "helpId");
    }
  },
};
