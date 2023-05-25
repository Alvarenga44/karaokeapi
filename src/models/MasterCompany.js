const { Model, DataTypes } = require('sequelize');

class MasterCompany extends Model {
  static init(sequelize) {
    super.init({
      cnpj: DataTypes.INTEGER,
      company_name: DataTypes.STRING,
      fantasy_name: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      img_url: DataTypes.STRING,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.hasMany(models.Users, { foreignKey: 'company_id', as: 'users' })
  }
}

module.exports = MasterCompany