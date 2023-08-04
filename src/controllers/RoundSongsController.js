const sequelize = require('sequelize');

const RoundSongs = require('../models/RoundSongs');
const Songs = require('../models/Songs');

module.exports = {
  async index(req, res) {
    try {
      const { company_id } = req.headers;
      const round_songs = await RoundSongs.findOne({
        where: {
          active: 1,
          company_id,
        },
        include: [{
          model: Songs,
          as: 'songs',
          where: {
            status: 'pending'
          }
        }],
        order: [
          [
              {model: Songs, as: 'songs'},
              'position',
              'ASC'
          ]
      ]
      });

      if (!round_songs) {
        return res.status(400).json('Nenhuma rodada em aberto');
      }

      return res.status(200).json(round_songs);
    } catch(error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir música, tente novamente',
        e
      })
    }
  },

  async update(req, res) {
    try {
      const { company_id } = req.headers;
      await RoundSongs.destroy({
        where: {
          active: 1,
          company_id
        }
      });

      const minIDRound = await RoundSongs.findAll({
        where: {
          active: 0,
          company_id
        },
        attributes: [
          sequelize.fn('MIN', sequelize.col('id')),
       ],
       raw: true,
      });
      
      const activedRound = await RoundSongs.findOne({
        where: {
          id: minIDRound[0]['MIN(`id`)']
        }
      });

      await activedRound.update({active: 1});
      await activedRound.save();

      return res.status(200).json('Rodada iniciada com sucesso');
      
    } catch(error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao atualizar rodadas, tente novamente',
        e
      })
    }
  }
}