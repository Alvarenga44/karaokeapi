const Scheduler = require('../models/Scheduler');

module.exports = {
  async index(req, res) {
    const { user_id } = req.headers;
    try {
      const schedule = await Scheduler.findAndCountAll({
        where: { user_id },
        include: [
          {
            all: true
          }
        ]
      });

      return res.status(200).json({
        schedule
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
      const schedule = await Scheduler.findOne({ id }, {
        include: [
          {
            all: true
          }
        ]
      });

      return res.status(200).json(schedule)
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir schedule, tente novamente',
        e
      })
    }
  },

  async store(req, res) {
    try {
      const { vehicle_id, user_id } = req.headers;
      const {
        amount,
        departure_hour,
        departure_date,
        departure_destination,
      } = req.body;

      const [schedule, created] = await Scheduler.findOrCreate({
        where: { departure_date },
        defaults: {
          amount,
          departure_hour,
          departure_date,
          departure_destination,
          vehicle_id,
          user_id,
          active: 1
        }
      });

      return res.status(201).json({
        title: 'Scheduler cadastrado com sucesso',
        created,
        schedule
      })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir schedule, tente novamente',
        e
      })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        amount,
        departure_date,
        departure_hour,
        departure_destination,
        vehicle_id,
        user_id,
        active,
      } = req.body;

      const schedule = await Scheduler.update({
        amount,
        departure_date,
        departure_hour,
        departure_destination,
        vehicle_id,
        user_id,
        active,
      }, {
        where: {
          id
        }
      });

      return res.status(200).json({ msg: 'Scheduler atualizado com sucesso', schedule })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir schedule, tente novamente',
        e
      })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const schedule = await Scheduler.destroy({ where: { id } });

      return res.status(200).json({ msg: 'Scheduler deletado com sucesso', schedule })
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir schedule, tente novamente',
        e
      })
    }
  },
}