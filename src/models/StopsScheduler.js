const bcrypt = require("bcrypt");
const { Model, DataTypes } = require('sequelize');
class StopsScheduler extends Model {
  static init(sequelize) {
    super.init({
      time: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
    }, {
      sequelize,
    })
  }

  static associate(models) {
    this.belongsTo(models.Scheduler, { foreignKey: 'scheduler_id' })
  }
}

module.exports = StopsScheduler