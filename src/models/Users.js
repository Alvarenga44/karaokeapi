const bcrypt = require("bcrypt");
const { Model, DataTypes } = require('sequelize');
class Users extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      is_driver: DataTypes.BOOLEAN,
      active: DataTypes.BOOLEAN,
    }, {
      sequelize,
    })

    Users.beforeCreate((user) => {

      return bcrypt.hash(user.password, 10)
        .then(hash => {
          user.password = hash;
        })
        .catch(err => {
          console.log(err)
          throw new Error();
        });
    });
  }

  static associate(models) {
    this.belongsTo(models.MasterCompany, { foreignKey: 'company_id', as: 'company' })
    this.belongsTo(models.Roles, { foreignKey: 'role_id', as: 'roles' })
    this.hasOne(models.Vehicle, { foreignKey: 'user_id' })
    this.hasMany(models.Scheduler, { foreignKey: 'user_id' })
    this.hasMany(models.UserScheduler, { foreignKey: 'user_id' })
  }
}

module.exports = Users