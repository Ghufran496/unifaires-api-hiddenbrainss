"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("helps", "status", {
      type: Sequelize.ENUM("pending", "assigned", "resolved", "disputed"),
      allowNull: false,
      defaultValue: "pending",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("helps", "status");
  },
};
