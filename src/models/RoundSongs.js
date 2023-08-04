const { Model, DataTypes } = require('sequelize');

class RoundSongs extends Model {
  static init(sequelize) {
    super.init({
      active: DataTypes.BOOLEAN,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.MasterCompany, { foreignKey: 'company_id', as: 'company' })
    this.hasMany(models.Songs, { foreignKey: 'round_id', as: 'songs' })
  }
}

module.exports = RoundSongs