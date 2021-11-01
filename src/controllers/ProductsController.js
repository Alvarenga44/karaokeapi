const Products = require('../models/Products');

module.exports = {
  async index(req, res) {
    try {
      const { company_id } = req.headers;
      const products = await Products.findAndCountAll({
        where: { company_id },
        include: [
          {
            all: true
          }
        ]
      });

      return res.status(200).json({
        products
      })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir produtos, tente novamente',
        e
      })
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const products = await Products.findOne({ id }, {
        include: [
          {
            all: true
          }
        ]
      });

      return res.status(200).json(products)
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir produtos, tente novamente',
        e
      })
    }
  },

  async store(req, res) {
    try {
      const { company_id, category_id } = req.headers;
      const {
        title,
        subtitle,
        price_value,
        available_quantity,
        small_quantity,
      } = req.body;

      const [products, created] = await Products.findOrCreate({
        where: { title },
        defaults: {
          title,
          subtitle,
          price_value,
          available_quantity,
          small_quantity,
          company_id,
          category_id,
          active: 1
        }
      });

      return res.status(201).json({
        title: 'Produtos cadastrada com sucesso',
        created,
        products
      })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir produtos, tente novamente',
        e
      })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        subtitle,
        company_id,
        category_id,
        active
      } = req.body;

      const products = await Products.update({
        title,
        subtitle,
        company_id,
        category_id,
        active
      }, {
        where: {
          id
        }
      });

      return res.status(200).json({ msg: 'Produtos atualizado com sucesso', products })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir produtos, tente novamente',
        e
      })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const products = await Products.destroy({ where: { id } });

      return res.status(200).json({ msg: 'Produtos deletado com sucesso', products })
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir produtos, tente novamente',
        e
      })
    }
  },
}