const MasterCompany = require('../models/MasterCompany');

module.exports = {
  async index(req, res) {
    try {
      const master_company = await MasterCompany.findAndCountAll({
        where: { active: 1 },
        include: [
          {
            association: 'users'
          }
        ]
      });

      return res.status(200).json({
        master_company
      })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir empresa, tente novamente',
        e
      })
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const master_company = await MasterCompany.findByPk(id);

      return res.status(200).json(master_company)
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir empresa, tente novamente',
        e
      })
    }
  },

  async store(req, res) {
    try {
      const {
        cnpj,
        company_name,
        fantasy_name,
        img_url,
      } = req.body;

      const [master_company, created] = await MasterCompany.findOrCreate({
        where: { cnpj },
        defaults: {
          cnpj,
          company_name,
          fantasy_name,
          img_url,
          active: 1
        }
      });

      return res.status(201).json({
        title: 'Empresa cadastrada com sucesso',
        created,
        master_company
      })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir empresa, tente novamente',
        e
      })
    }
  },

  async update(req, res) {
    try {
      const { location: url = '' } = req.file;
      const { id } = req.params;
      const {
        cnpj,
        company_name,
        fantasy_name,
        active,
      } = req.body;

      const master_company = await MasterCompany.update({
        cnpj,
        company_name,
        fantasy_name,
        active,
        img_url: url,
      }, {
        where: {
          id
        }
      });

      return res.status(200).json({ msg: 'Empresa atualizado com sucesso', master_company })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir empresa, tente novamente',
        e
      })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const master_company = await MasterCompany.destroy({ where: { id } });

      return res.status(200).json({ msg: 'Empresa deletado com sucesso', master_company })
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir empresa, tente novamente',
        e
      })
    }
  },
}