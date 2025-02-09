"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("jobarchives", "userId");
    await queryInterface.removeColumn("jobarchives", "businessId");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("jobarchives", "userId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addColumn("jobarchives", "businessId", {
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
