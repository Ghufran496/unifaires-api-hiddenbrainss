"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the columns already exist before adding them
    const fundingDescriptionColumnExists = await queryInterface
      .describeTable("fundingbusinesspricings")
      .then((tableDefinition) => "description" in tableDefinition);

    const jobDescriptionColumnExists = await queryInterface
      .describeTable("jobbusinesspricings")
      .then((tableDefinition) => "description" in tableDefinition);

    // Add the columns only if they don't already exist
    if (!fundingDescriptionColumnExists) {
      await queryInterface.addColumn("fundingbusinesspricings", "description", {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: true,
      });
    }

    if (!jobDescriptionColumnExists) {
      await queryInterface.addColumn("jobbusinesspricings", "description", {
        type: Sequelize.TEXT({ length: "long" }),
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Check if the columns exist before removing them
    const fundingDescriptionColumnExists = await queryInterface
      .describeTable("fundingbusinesspricings")
      .then((tableDefinition) => "description" in tableDefinition);

    const jobDescriptionColumnExists = await queryInterface
      .describeTable("jobbusinesspricings")
      .then((tableDefinition) => "description" in tableDefinition);

    // Remove the columns only if they exist
    if (fundingDescriptionColumnExists) {
      await queryInterface.removeColumn(
        "fundingbusinesspricings",
        "description"
      );
    }

    if (jobDescriptionColumnExists) {
      await queryInterface.removeColumn("jobbusinesspricings", "description");
    }
  },
};
