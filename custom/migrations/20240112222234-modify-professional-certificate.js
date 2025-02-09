"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Modify column types for 'fromYear' and 'endYear'
    await queryInterface.changeColumn("professionalcertificates", "year", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
  async down(queryInterface, Sequelize) {
    // Revert the changes if needed
    await queryInterface.changeColumn("professionalcertificates", "year", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
