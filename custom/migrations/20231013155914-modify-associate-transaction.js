"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("associatetransactions", "paymentId", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // In case you need to revert the change, you can set it back to INTEGER.
    await queryInterface.changeColumn("associatetransactions", "paymentId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
