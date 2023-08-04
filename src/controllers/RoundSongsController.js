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
      return res.status(500).json('INTERNAL SERVER ERROR')
    }
  }
}