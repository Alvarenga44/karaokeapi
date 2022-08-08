'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('users', [
      {
        name: 'Francisco Alvarenga',
        email: 'franciscocarlos002@outlook.com',
        password: "$2a$12$1VKKiNUD20/J1BI82c.Td.7wsUloMNhghA6h35SGE8KhtP.zL9qDy",
        role_id: 1,
        company_id: 1,
        active: 1,
        is_driver: 1,
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
