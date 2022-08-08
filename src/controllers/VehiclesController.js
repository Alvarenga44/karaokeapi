const Vehicle = require('../models/Vehicle');

module.exports = {
  async index(req, res) {
    const { company_id } = req.headers;
    try {
      const vehicles = await Vehicle.findAndCountAll({
        where: { company_id },
        include: [
          {
            all: true
          }
        ]
      });

      return res.status(200).json({
        vehicles
      })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao listar veículos, tente novamente',
        e
      })
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const vehicles = await Vehicle.findOne({ id }, {
        include: [
          {
            all: true
          }
        ]
      });

      return res.status(200).json(vehicles)
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
      const { company_id, user_id } = req.headers;
      const {
        model,
        version,
        plate,
        color,
      } = req.body;

      const [vehicles, created] = await Vehicle.findOrCreate({
        where: { plate },
        defaults: {
          model,
          version,
          plate,
          color,
          company_id,
          user_id,
          active: 1
        }
      });

      return res.status(201).json({
        title: 'Veículo cadastrado com sucesso',
        created,
        vehicles
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
        model,
        version,
        plate,
        color,
        company_id,
        user_id,
        active,
      } = req.body;

      const vehicles = await Vehicle.update({
        model,
        version,
        plate,
        color,
        company_id,
        user_id,
        active,
      }, {
        where: {
          id
        }
      });

      return res.status(200).json({ msg: 'Veículo atualizado com sucesso', vehicles })
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
      const { id } = req.params;
      const vehicles = await Vehicle.destroy({ where: { id } });

      return res.status(200).json({ msg: 'Veículo deletado com sucesso', vehicles })
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