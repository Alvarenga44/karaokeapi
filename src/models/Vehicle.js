const { Model, DataTypes } = require('sequelize');

class Vehicle extends Model {
  static init(sequelize) {
    super.init({
      model: DataTypes.STRING,
      version: DataTypes.STRING,
      plate: DataTypes.STRING,
      color: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.MasterCompany, { foreignKey: 'company_id', as: 'company' })
    this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' })
    this.hasMany(models.Scheduler, { foreignKey: 'vehicle_id', as: 'schedulers' })
  }
}

module.exports = Vehicle