'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('master_companies', [
      {
        cnpj: '00000000000001',
        company_name: "KARAOKE LEVIANOS BAR LTDA",
        fantasy_name: "KARAOKE LEVIANOS BAR",
        img_url: "",
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
