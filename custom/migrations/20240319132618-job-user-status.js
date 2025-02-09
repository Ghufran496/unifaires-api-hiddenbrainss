"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns

    await queryInterface.removeColumn("jobenrols", "jobUserStatus");

    await queryInterface.addColumn("jobenrols", "jobUserStatus", {
      type: Sequelize.ENUM(
        "interviewing",
        "hiring",
        "cancelled",
        "closed",
        "pending",
        "accepted",
        "rejected"
      ),
      allowNull: false,
      defaultValue: "pending",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("jobenrols", "firstname");
  },
};
