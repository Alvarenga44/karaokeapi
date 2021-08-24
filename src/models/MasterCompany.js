const { Model, DataTypes } = require('sequelize');

class MasterCompany extends Model {
  static init(sequelize) {
    super.init({
      cnpj: Sequelize.INTEGER,
      company_name:  Sequelize.STRING,
      fantasy_name: Sequelize.STRING,
      active: Sequelize.BOOLEAN,
      img_url: Sequelize.STRING,
    }, {
      sequelize
    })
  }

  static associate(models) {
    
  }
}

module.exports = MasterCompany