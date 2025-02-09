"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("businesses", "establishmentDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("businesses", "language", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("businesses", "establishmentDate");
    await queryInterface.removeColumn("businesses", "language");
  },
};
