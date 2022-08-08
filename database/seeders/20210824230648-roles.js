'use strict';

module.exports = {
  up: async (queryInterface) => {

    return queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'management',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'employee',
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },

  down: async () => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
