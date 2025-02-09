// migrations/YYYYMMDDHHMMSS-create-businesses.js

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("businesses", "imageUrl", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("businesses", "meta", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("businesses", "imageUrl");
    await queryInterface.removeColumn("businesses", "meta");
  },
};
