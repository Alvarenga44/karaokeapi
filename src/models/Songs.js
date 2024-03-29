const { Model, DataTypes } = require('sequelize');

class Songs extends Model {
  static init(sequelize) {
    super.init({
      table_command: DataTypes.INTEGER,
      table_number: DataTypes.STRING,
      song_name: DataTypes.STRING,
      artist_name: DataTypes.STRING,
      waiting_time: DataTypes.INTEGER,
      status: DataTypes.STRING,
      position: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      date_song: DataTypes.STRING
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.RoundSongs, { foreignKey: 'round_id', as: 'round' }),
    this.belongsTo(models.MasterCompany, { foreignKey: 'company_id', as: 'company' })
  }
}

module.exports = Songs