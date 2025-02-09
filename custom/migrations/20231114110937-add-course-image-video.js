"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'image' and 'video' columns to the 'courses' table
    await queryInterface.addColumn("courses", "image", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });

    await queryInterface.addColumn("courses", "video", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'image' and 'video' columns from the 'courses' table
    await queryInterface.removeColumn("courses", "image");
    await queryInterface.removeColumn("courses", "video");
  },
};
