const { Model, DataTypes } = require('sequelize');

class Scheduler extends Model {
  static init(sequelize) {
    super.init({
      departure_date: DataTypes.STRING,
      departure_hour: DataTypes.STRING,
      departure_destination: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' })
    this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' })
  }
}

module.exports = Scheduler