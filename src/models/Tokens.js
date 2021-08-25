const bcrypt = require("bcrypt");
const { Model, DataTypes } = require('sequelize');
class Tokens extends Model {
  static init(sequelize) {
    super.init({
      token: DataTypes.STRING,
    }, {
      sequelize,
    })
  }
}

module.exports = Tokens