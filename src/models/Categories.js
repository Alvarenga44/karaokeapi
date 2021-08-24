const { Model, DataTypes } = require('sequelize');

class Categories extends Model {
  static init(sequelize) {
    super.init({
      title: DataTypes.STRING,
      subtitle: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.MasterCompany, { foreignKey: 'company_id', as: 'company' })
    this.hasMany(models.Products, { foreignKey: 'category_id', as: 'products' })
  }
}

module.exports = Categories