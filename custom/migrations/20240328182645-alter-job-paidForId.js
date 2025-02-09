// migrations/YYYYMMDDHHMMSS-alter-transactions-paidForId.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("transactions", "paidForId", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("transactions", "paidForId", {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
};
