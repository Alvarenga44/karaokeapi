const { Model, DataTypes } = require('sequelize');

class Roles extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.hasMany(models.Users, { foreignKey: 'role_id', as: 'users' })
  }
}

module.exports = Roles