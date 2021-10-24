'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('master_companies', [
      {
        cnpj: 65069593000198,
        company_name: "Alvarenga Desenvolvimento LTDA",
        fantasy_name: "Alvarenga Technology",
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
