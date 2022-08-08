'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('master_companies', [
      {
        cnpj: '13794399000171',
        company_name: "IDEA MAKER MEIOS DE PAGAMENTO E CONSULTORIA LTDA",
        fantasy_name: "IDEA MAKER SOLUTIONS",
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
