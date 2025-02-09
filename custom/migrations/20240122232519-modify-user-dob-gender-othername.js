"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "gender", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("users", "dateOfBirth", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn("users", "othername", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // If you want to revert the changes, you can set allowNull back to false
    await queryInterface.changeColumn("users", "gender", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("users", "date_of_birth", {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn("users", "othername", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
