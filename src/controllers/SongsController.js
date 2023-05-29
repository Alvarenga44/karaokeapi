const dayjs = require('dayjs');
const sequelize = require('sequelize');

const Songs = require('../models/Songs');

module.exports = {
  async index(req, res) {
    try {
      const songs = await Songs.findAndCountAll({
        where: {
          status: 'pending'
        },
        order: [
          ['position', 'ASC']
        ],
        include: [
          {
            all: true
          }
        ]
      });

      //const today = new Date();

      // const formatedScheduler = schedule.rows.filter(s => s.departure_date >= dayjs(today).format('DD/MM/YYYY'));
      // console.log(today);
      // console.log(dayjs(today).format('DD-MM-YYYY'));

      return res.status(200).json({
        songs
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
      const songs = await Songs.findAndCountAll({
        include: [
          {
            all: true
          }
        ],
        where: { id }
      });

      if (!songs) {
        return res.status(404).json({ msg: 'Música não encontrada!' })
      }

      return res.status(200).json(songs)
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao encontrar música, tente novamente',
        e
      })
    }
  },

  async store(req, res) {
    try {
      const {
        table_command,
        table_number,
        song_name,
        artist_name,
        company_id
      } = req.body;

      let findSongs = await Songs.findAll({
        where: { company_id },
        raw: true
      });
      // Caso nao tenha musicas cadastradas na base
      if(findSongs.length <= 0) {
        const song = await Songs.create({
          table_command,
          table_number,
          song_name,
          artist_name,
          status: 'pending',
          position: 1,
          company_id,
          active: 1,
          waiting_time: 60
        });

        return res.status(201).json({
          title: 'Música cadastrado com sucesso',
          song
        })
      }

      const songCommand = await Songs.findOne({
        where: {
          table_command
        }
      })

      const maxPositionResult = await Songs.findAll({
        attributes: [
           sequelize.fn('MAX', sequelize.col('position')),
        ],
        raw: true,
        where: { company_id }
      })

      const minPositionResult = await Songs.findAll({
        attributes: [
           sequelize.fn('MIN', sequelize.col('position')),
        ],
        raw: true,
        where: { company_id }
      })

      const songTable = await Songs.findAll({
        where: {
          table_number
        }
      })

      if (!songCommand && songTable.length == 0) {
         // ATUALIZA AS POSICOES
        findSongs.map(async songs => {
          console.log('position', songs.position)
          if (songs.position >= 3) {
            const song = await Songs.findOne({ where: { company_id, position: songs.position } })
            await song.update({position: song.position + 1});
            await song.save();
          }
        })
        // ADICIONA A NOVA MUSICA
        const song = await Songs.create({
          table_command,
          table_number,
          song_name,
          artist_name,
          status: 'pending',
          position: minPositionResult[0]['MIN(`position`)'] + 2,
          company_id,
          active: 1,
          waiting_time: 60
        });

        return res.status(201).json({
          title: 'Música cadastrada com sucesso',
          song
        })
      }

      if (findSongs.length > 0) {
        // Existe comanda em aberto e esta com status pendente
        if (songCommand && songCommand.status == "pending") {
          // VEDRFICA SE EXISTE MESA
          if (songTable.length > 0) {
            const song = await Songs.create({
              table_command,
              table_number,
              song_name,
              artist_name,
              status: 'pending',
              position: maxPositionResult[0]['MAX(`position`)'] + 1,
              company_id,
              active: 1,
              waiting_time: 60
            });

            return res.status(201).json({
              title: 'Música cadastrada com sucesso',
              song
            })
          }
        }
        // REGRA PARA QUANDO COMANDA NAO CANTOU
        if (!songCommand) {
          // Verifica se mesa ja tem musica
          if (songTable.length > 0 && songTable.status !== 'canceled') {
            // ATUALIZA AS POSICOES
            findSongs.map(async songs => {
              console.log('position', songs.position)
              if (songs.position >= 3) {
                const song = await Songs.findOne({ where: { company_id, position: songs.position } })
                await song.update({position: song.position + 1});
                await song.save();
              }
            })
            // ADICIONA A NOVA MUSICA
            const song = await Songs.create({
              table_command,
              table_number,
              song_name,
              artist_name,
              status: 'pending',
              position: minPositionResult[0]['MIN(`position`)'] + 2,
              company_id,
              active: 1,
              waiting_time: 60
            });

            return res.status(201).json({
              title: 'Música cadastrada com sucesso',
              song
            })
          }
        }
        return res.json(findSongs)
      }

      return res.status(201).json({
        title: 'Música cadastrado com sucesso'
      })
    } catch (error) {
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