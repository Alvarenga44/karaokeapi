'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('users', [
      {
        name: 'Francisco Alvarenga',
        email: 'franciscocarlos002@outlook.com',
        password: "$2a$12$Np49tcMjM1F7Jq2ADDO6Geb7SK79iqJGOx3mmwsYROswz17fSyg26",
        role_id: 1,
        company_id: 1,
        active: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
