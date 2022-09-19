const UserScheduler = require('../models/UserScheduler');

module.exports = {
  async index(req, res) {
    try {
      const userSchedule = await UserScheduler.findAndCountAll({
        include: [
          {
            all: true
          }
        ]
      });

      return res.status(200).json({
        userSchedule
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
      const userSchedule = await UserScheduler.findAndCountAll({
        include: [
          {
            all: true
          }
        ],
        where: { id }
      });

      if (!userSchedule) {
        return res.status(404).json({ msg: 'Reserva não encontrada!' })
      }

      return res.status(200).json(userSchedule)
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir reserva, tente novamente',
        e
      })
    }
  },

  async store(req, res) {
    try {
      const { scheduler_id, user_id } = req.headers;
      const {
        observations,
      } = req.body;

      const userSchedule = await UserScheduler.create({
        payment_status: 'PENDING',
        observations,
        user_id,
        scheduler_id,
        active: 1
      });

      return res.status(201).json({
        title: 'Reserva cadastrada com sucesso',
        userSchedule
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
        payment_status,
        scheduler_id,
        user_id,
        observations,
        active,
      } = req.body;

      const userSchedule = await UserScheduler.update({
        payment_status,
        scheduler_id,
        user_id,
        observations,
        active,
      }, {
        where: {
          id
        }
      });

      return res.status(200).json({ msg: 'Reserva atualizado com sucesso', userSchedule })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir resrva, tente novamente',
        e
      })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userSchedule = await UserScheduler.destroy({ where: { id } });

      return res.status(200).json({ msg: 'Reserva deletado com sucesso', schedule })
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir reserva, tente novamente',
        e
      })
    }
  },
}