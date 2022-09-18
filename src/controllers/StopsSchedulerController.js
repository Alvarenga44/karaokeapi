const StopsScheduler = require('../models/StopsScheduler');

module.exports = {
  async index(req, res) {
    try {
      const stopsScheduler = await StopsScheduler.findAndCountAll({
        include: [
          {
            all: true
          }
        ]
      });

      return res.status(200).json({
        stopsScheduler
      })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao listar paradas, tente novamente',
        e
      })
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const stopsScheduler = await StopsScheduler.findAndCountAll({
        include: [
          {
            all: true
          }
        ],
        where: { id }
      });

      if (!stopsScheduler) {
        return res.status(404).json({ msg: 'Paradas não encontrada!' })
      }

      return res.status(200).json(stopsScheduler)
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir stopsScheduler, tente novamente',
        e
      })
    }
  },

  async store(req, res) {
    try {
      const { scheduler_id } = req.headers;
      const {
        time,
        title,
        description
      } = req.body;

      const stopsScheduler = await StopsScheduler.create({
        time,
        title,
        description,
        scheduler_id
      });

      return res.status(201).json({
        title: 'StopsScheduler cadastrado com sucesso',
        stopsScheduler
      })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir stopsScheduler, tente novamente',
        e
      })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        time,
        title,
        description
      } = req.body;

      const stopsScheduler = await StopsScheduler.update({
        time,
        title,
        description
      }, {
        where: {
          id
        }
      });

      return res.status(200).json({ msg: 'Scheduler atualizado com sucesso', stopsScheduler })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir stopsScheduler, tente novamente',
        e
      })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const stopsScheduler = await StopsScheduler.destroy({ where: { id } });

      return res.status(200).json({ msg: 'StopsScheduler deletado com sucesso', stopsScheduler })
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir stopsScheduler, tente novamente',
        e
      })
    }
  },
}