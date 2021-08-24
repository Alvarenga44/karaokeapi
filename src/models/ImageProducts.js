const { Model, DataTypes } = require('sequelize');

class ImageProducts extends Model {
  static init(sequelize) {
    super.init({
      img_url: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.Products, { foreignKey: 'product_id', as: 'products' })
  }
}

module.exports = ImageProducts