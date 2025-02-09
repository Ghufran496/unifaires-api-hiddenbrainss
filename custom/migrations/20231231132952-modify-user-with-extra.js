"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("users", "currentProfessionalRole", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "estimatedYearlySalary", {
      type: Sequelize.DECIMAL(10, 2), // Adjust precision and scale as needed
      allowNull: true,
    });

    await queryInterface.addColumn("users", "aboutMe", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });

    await queryInterface.addColumn("users", "yearsOfExperience", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "personality", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("users", "currentProfessionalRole");
    await queryInterface.removeColumn("users", "estimatedYearlySalary");
    await queryInterface.removeColumn("users", "aboutMe");
    await queryInterface.removeColumn("users", "yearsOfExperience");
    await queryInterface.removeColumn("users", "personality");
  },
};
