"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns
    await queryInterface.addColumn("jobenrols", "firstname", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("jobenrols", "lastname", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("jobenrols", "telephoneAvailability", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("jobenrols", "unifairesProfileLink", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("jobenrols", "coverLetter", {
      type: Sequelize.TEXT({ length: "long" }),
      allowNull: true,
    });

    await queryInterface.addColumn("jobenrols", "phoneNumber", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("jobenrols", "email", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("jobenrols", "availabilityFrom", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn("jobenrols", "jobUserStatus");

    await queryInterface.addColumn("jobenrols", "jobUserStatus", {
      type: Sequelize.ENUM(
        "interviewing",
        "hiring",
        "cancelled",
        "closed",
        "pending"
      ),
      allowNull: false,
      defaultValue: "pending",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("jobenrols", "firstname");
    await queryInterface.removeColumn("jobenrols", "lastname");
    await queryInterface.removeColumn("jobenrols", "telephoneAvailability");
    await queryInterface.removeColumn("jobenrols", "unifairesProfileLink");
    await queryInterface.removeColumn("jobenrols", "coverLetter");
    await queryInterface.removeColumn("jobenrols", "phoneNumber");
    await queryInterface.removeColumn("jobenrols", "email");
    await queryInterface.removeColumn("jobenrols", "availabilityFrom");
  },
};
