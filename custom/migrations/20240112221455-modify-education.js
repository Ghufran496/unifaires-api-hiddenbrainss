"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Modify column types for 'fromYear' and 'endYear'
    await queryInterface.changeColumn("education", "fromYear", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("education", "endYear", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("education", "description", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    // Revert the changes if needed
    await queryInterface.changeColumn("education", "fromYear", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn("education", "endYear", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.removeColumn("education", "description");
  },
};
