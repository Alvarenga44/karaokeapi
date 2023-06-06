const sequelize = require('sequelize');
const { Server } = require('socket.io');

const Songs = require('../models/Songs');

const io = new Server(4000, {
  cors: {
    origin: '*',
  },
});

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

  async showClientSong(req, res) {
    try {
      const { table_command, company_id } = req.body;

      if (!table_command && !company_id) {
        return res.status(400).json('Informe o número da comanda e empresa a ser consultada')
      }

      if (!table_command) {
        return res.status(400).json('Informe o número da comanda')
      }

      if (!company_id) {
        return res.status(400).json('Informe a empresa a ser consultada')
      }

      const songs = await Songs.findAndCountAll({
        where: {
          table_command,
          company_id
        },
        order: [
          ['position', 'ASC']
        ],
      })

      if (songs.rows.length == 0) {
        return res.status(400).json("Nenhuma música encontrada com am comanda informada.")
      }

      return res.status(200).json(songs);
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

      console.log(
        table_command,
        table_number,
        song_name,
        artist_name,
        company_id
      )

      let findSongs = await Songs.findAll({
        where: { company_id, position: { [sequelize.Op.not]: 0 } },
        raw: true
      });
      // Caso nao tenha musicas cadastradas na base
      if(findSongs.length <= 0) {
        console.log('if 1')
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

        io.emit('updateSong', "Nova música cadastrada")

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
        where: { company_id, status: 'pending' }
      })

      const minPositionResult = await Songs.findAll({
        attributes: [
           sequelize.fn('MIN', sequelize.col('position')),
        ],
        raw: true,
        where: { 
          company_id,
          status: 'pending'
        }
      })

      const songTable = await Songs.findAll({
        where: {
          table_number
        }
      })

      if (!songCommand && songTable.length == 0) {
        console.log('if 2')
         // ATUALIZA AS POSICOES
        findSongs.map(async songs => {
          if (songs.position >= 2 && songs.status == 'pending') {
            const song = await Songs.findOne({ where: { company_id, position: songs.position } })
            if (song.status == 'pending' && song.position >= 2) {
              const newPosition = song.position + 1
              await song.update({position: newPosition});
              await song.save();
            }
          }
        })      
        //ADICIONA A NOVA MUSICA
        const song = await Songs.create({
          table_command,
          table_number,
          song_name,
          artist_name,
          status: 'pending',
          position: minPositionResult[0]['MIN(`position`)'] + 1, // Position 2
          company_id,
          active: 1,
          waiting_time: 60
        });

        io.emit('updateSong', "Nova música cadastrada")

        return res.status(201).json({
          title: 'Música cadastrada com sucesso',
          song
        })
      }
      if (findSongs.length > 0) {
        console.log('if 3')
        // Existe comanda em aberto e esta com status pendente
        if (songCommand && songCommand.status == "pending") {
          console.log('if 4')
          // VEDRFICA SE EXISTE MESA
          if (songTable.length > 0) {
            console.log('if 5')
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

            io.emit('updateSong', "Nova música cadastrada")

            return res.status(201).json({
              title: 'Música cadastrada com sucesso',
              song
            })
          }
        }
        // REGRA PARA QUANDO COMANDA NAO CANTOU
        if (!songCommand) {
          console.log('if 6')
          // Verifica se mesa ja tem musica
          if (songTable.length > 0 && songTable.status !== 'canceled' || songTable.status !== 'approved') {
            console.log('if 7')
            // ATUALIZA AS POSICOES
            findSongs.map(async songs => {
              if (songs.position >= 3 && songs.status == 'pending') {
                const song = await Songs.findOne({ where: { company_id, position: songs.position } })
                if (song.status == 'pending' && song.position >= 3) {
                  const newPosition = song.position + 1
                  await song.update({position: newPosition});
                  await song.save();
                }
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

            io.emit('updateSong', "Nova música cadastrada")

            return res.status(201).json({
              title: 'Música cadastrada com sucesso',
              song
            })
          }
        }
        return res.json(findSongs)
      }

      io.emit('updateSong', "Nova música cadastrada")

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
        company_id,
        status
      } = req.body;

      let findSongs = await Songs.findAll({
        where: { company_id },
        raw: true
      });

      const song = await Songs.update({
        status,
        position: 0
      }, {
        where: {
          id
        }
      });

      if (status != 'approved') {
        return res.status(400).json({ msg: 'Status informado incorretamente', status: status })
      }
      // ATUALIZA AS POSICOES
      // ATUALIZA AS POSICOES
      if (status == 'approved') {
        for(let songs of findSongs) {
          if (songs.position >= 2) {
            const newPosition = songs.position - 1
            await Songs.update({
              position: newPosition
            }, {
              where: {
                company_id,
                id: songs.id
              }
            });
          }
        }
      }

      io.emit('updateSong', "Nova música atualizada")
      
      return res.status(200).json({ msg: 'Música atualizada com sucesso', song })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao atualizar música, tente novamente',
        e
      })
    }
  },

  async cancelMusic(req, res) {
    try {
      const { id } = req.params;
      const {
        company_id,
        status
      } = req.body;

      if (status != 'canceled') {
        return res.status(400).json({ msg: 'Status informado incorretamente.', status: status })
      }

      let findSongs = await Songs.findAll({
        where: { company_id, status: 'pending' },
        raw: true
      });

      const songToUpdate = await Songs.findOne({
        where: {
          id
        }
      });

      let originPosition = songToUpdate.position;

      await songToUpdate.update({ position: 0, status });
      await songToUpdate.save();

      // ATUALIZA AS POSICOES
      for(let songs of findSongs) {
        console.log({'origin_position': originPosition, 'position': songs.position})
        if (songs.position >= originPosition && songs.status == 'pending') {
          const newPosition = songs.position - 1
          await Songs.update({
            position: newPosition
          }, {
            where: {
              company_id,
              id: songs.id
            }
          });
        }
      }
      io.emit('updateSong', "Nova música atualizada")
      
      return res.status(200).json({ msg: 'Música atualizada com sucesso', songToUpdate })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao atualizar música, tente novamente',
        e
      })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const song = await Song.destroy({ where: { id } });

      return res.status(200).json({ msg: 'Música deletada com sucesso', song })
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao deletar schedula, tente novamente',
        e
      })
    }
  },
}