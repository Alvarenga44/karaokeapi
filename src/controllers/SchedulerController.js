const Scheduler = require('../models/Scheduler');
const Driver = require('../models/Users');
const Vehicle = require('../models/Vehicle');

module.exports = {
  async index(req, res) {
    try {
      const schedule = await Scheduler.findAndCountAll({
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
      const schedule = await Scheduler.findAndCountAll({
        include: [
          {
            all: true
          }
        ],
        where: { id }
      });

      if (!schedule) {
        return res.status(404).json({ msg: 'Viagem não encontrada!' })
      }

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
        total_reservations,
        amount,
        departure_hour,
        departure_date,
        departure_destination,
      } = req.body;

      const schedule = await Scheduler.create({

        total_reservations,
        amount,
        departure_hour,
        departure_date,
        departure_destination,
        vehicle_id,
        user_id,
        active: 1

      });

      return res.status(201).json({
        title: 'Scheduler cadastrado com sucesso',
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
        total_reservations,
        amount,
        departure_date,
        departure_hour,
        departure_destination,
        vehicle_id,
        user_id,
        active,
      } = req.body;

      const schedule = await Scheduler.update({
        total_reservations,
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