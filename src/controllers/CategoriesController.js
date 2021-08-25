const Categories = require('../models/Categories');

module.exports = {
  async index(req, res) {
    try {
      const categories = await Categories.findAndCountAll({where: {active: 1},
        include: [
          {
            association: 'company'
          }
        ]
      });

      return res.status(200).json({
        categories
      })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir categoria, tente novamente',
        e
      })
    }
  },

  async show(req, res) {
    try {
      const {id} = req.params;
      const categories = await Categories.findByPk(id);

      return res.status(200).json(categories)
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir categoria, tente novamente',
        e
      })
    }
  },

  async store(req, res) {
    try {
      const { company_id } = req.headers;
      const { 
        title,
        subtitle,
      } = req.body;  

      const [categories, created] = await Categories.findOrCreate({
        where: { title },
        defaults: {
          title,
          subtitle,
          company_id,
          active: 1
        }
       });

      return res.status(201).json({
        title: 'Categoria cadastrada com sucesso',
        created,
        categories
      })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir categoria, tente novamente',
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
        active,
      } = req.body;

      const categories = await Categories.update({
        title,
        subtitle,
        company_id,
        active,
      }, {where: {
        id
      }});

      return res.status(200).json({msg: 'Categoria atualizado com sucesso', categories})
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir categoria, tente novamente',
        e
      })
    }
  },

  async delete(req, res) {
    try {
      const {id} = req.params;
      const categories = await Categories.destroy({where: {id}});

      return res.status(200).json({msg: 'Categoria deletado com sucesso', categories})
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir categoria, tente novamente',
        e
      })
    }
  },
}