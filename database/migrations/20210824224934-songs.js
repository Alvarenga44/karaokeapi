'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return await queryInterface.createTable('songs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'master_companies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      table_command: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      table_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      song_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      artist_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      waiting_time: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
