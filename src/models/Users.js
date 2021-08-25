const bcrypt = require("bcrypt");
const { Model, DataTypes } = require('sequelize');
class Users extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    }, {
      sequelize,
    })

    Users.beforeCreate((user, options) => {

      return bcrypt.hash(user.password, 10)
        .then(hash => {
          user.password = hash;
        })
        .catch(err => { 
            throw new Error(); 
        });
    });
  }

  static associate(models) {
    this.belongsTo(models.MasterCompany, { foreignKey: 'company_id', as: 'company' })
    this.belongsTo(models.Roles, { foreignKey: 'role_id', as: 'roles' })
  }
}

module.exports = Users