const { Model, DataTypes } = require('sequelize');

class Scheduler extends Model {
  static init(sequelize) {
    super.init({
      total_reservations: DataTypes.STRING,
      amount: DataTypes.STRING,
      departure_date: DataTypes.STRING,
      departure_hour: DataTypes.STRING,
      departure_destination: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' })
    this.hasMany(models.StopsScheduler, { foreignKey: 'scheduler_id' })

  }
}

module.exports = Scheduler