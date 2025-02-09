"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("jobwishes", "businessId");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("jobwishes", "businessId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "businesses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
};
