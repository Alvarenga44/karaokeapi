const { Model, DataTypes } = require('sequelize');

class Products extends Model {
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
    this.belongsTo(models.Categories, { foreignKey: 'category_id', as: 'categories' })
    this.hasMany(models.ImageProducts, { foreignKey: 'product_id', as: 'image_products' })
  }
}

module.exports = Products