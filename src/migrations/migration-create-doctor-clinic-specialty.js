"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("doctor-clinic-specialty", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // khoa chinh
        type: Sequelize.INTEGER, // chi có kieu integer moi tu tang duoc
      },
      doctorId: {
        type: Sequelize.INTEGER,
      },
      clinicId: {
        type: Sequelize.INTEGER,
      },
      specialtyId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("doctor-clinic-specialty");
  },
};
