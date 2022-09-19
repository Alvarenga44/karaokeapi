const UserScheduler = require('../models/UserScheduler');
const Scheduler = require('../models/Scheduler');

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


      const scheduler = await Scheduler.findOne({ id: scheduler_id });

      if (scheduler.total_reservations === 0) {
        return res.status(403).json({ msg: 'Essa viagem está cheia' })
      }

      const findUserSchedulerByUserId = await UserScheduler.findOne({ user_id });

      if (findUserSchedulerByUserId) {
        return res.status(403).json({ msg: 'Você já está nesta carona.' });
      }

      const userSchedule = await UserScheduler.create({
        payment_status: 'PENDING',
        observations,
        user_id,
        scheduler_id,
        active: 1
      });

      if (userSchedule) {
        scheduler.total_reservations = scheduler.total_reservations - 1;
        await scheduler.save()
      }
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
      const { user_id } = req.headers;

      const verifyUserScheduler = await UserScheduler.findOne({ id });

      if (!verifyUserScheduler) {
        return res.status(404).json({ msg: 'Nenhuma reserva vinculada a esse usuário' });
      }

      const scheduler = await Scheduler.findOne({ id: verifyUserScheduler.scheduler_id });

      if (!scheduler) {
        return res.status(404).json({ msg: 'Nenhuma viagem vinculada a essa reserva' });
      }

      scheduler.total_reservations = scheduler.total_reservations + 1;
      await verifyUserScheduler.destroy()
      await scheduler.save();

      return res.status(200).json({ msg: 'Reserva deletado com sucesso' });
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao deletar reserva, tente novamente',
        e
      })
    }
  },
}