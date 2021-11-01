const Categories = require('../../models/Categories');
const MasterCompany = require('../../models/MasterCompany');

module.exports = {
  async index(req, res) {
    try {
      const { cnpj } = req.headers;
      const company = await MasterCompany.findOne({ cnpj });

      if (!company) {
        return res.status(404).json({ msg: 'Empresa não encontrada' })
      }

      if (company.active === false) {
        return res.status(404).json({ msg: 'Cardapio não disponível no momento.' })
      }
      const categories = await Categories.findAndCountAll({
        where: { company_id: company.id },
        include: [
          {
            all: true
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
        title: 'Falha ao inserir produtos, tente novamente',
        e
      })
    }
  },
}