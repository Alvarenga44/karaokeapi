const { Model, DataTypes } = require('sequelize');

class UserScheduler extends Model {
  static init(sequelize) {
    super.init({
      payment_status: DataTypes.STRING,
      observations: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.Scheduler, { foreignKey: 'scheduler_id' });
    this.belongsTo(models.Users, { foreignKey: 'user_id' });
  }
}

module.exports = UserScheduler