"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // nap dư lieu vao DB
    return queryInterface.bulkInsert("Users", [
      // ham bulkInsert de chen nhieu bang ghi cung luc
      {
        email: "admin@gmail.com",
        password: "123456",
        firstName: "Lu",
        lastName: "Tan Dat",
        address: "Can Tho",
        gender: 1,
        typeRole: "ROLE",
        keyRole: "R1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
