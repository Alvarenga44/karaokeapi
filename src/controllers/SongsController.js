const sequelize = require('sequelize');
const { Server } = require('socket.io');
const moment = require('moment');

const Songs = require('../models/Songs');
const Company = require('../models/MasterCompany');
const RoundSongs = require('../models/RoundSongs');

const io = new Server(4000, {
  cors: {
    origin: '*',
  },
});

module.exports = {
  async index(req, res) {
    try {
      const { company_id } = req.headers;
      const songs = await Songs.findAndCountAll({
        where: {
          status: 'pending',
          company_id
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

      const company = await Company.findOne({raw: true, where: {id: company_id}});
      const today = moment().format('YYYY-MM-DD HH:mm:ss');

      if (!company.isopen) {
        return res.status(400).json("Músicas encerradas.")
      }

      // CRIAÇÃO RODADAS DE MÚSICAS
      let active_round_id;
      const round_songs = await RoundSongs.findOne({where: { active: 1 }});
      if (!round_songs) {
        const cretedRound = await RoundSongs.create({
          company_id,
          active: 1
        });
        active_round_id = cretedRound.id
      } else {
        active_round_id = round_songs.id
      }

      let findSongs = await Songs.findAll({
        where: { company_id, status: 'pending', position: { [sequelize.Op.not]: 0 } },
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
          waiting_time: 60,
          round_id: active_round_id,
          date_song: today
        });

        io.emit('updateSong', "Nova música cadastrada")

        return res.status(201).json({
          title: 'Música cadastrado com sucesso',
          song
        })
      }

      const songCommand = await Songs.findOne({
        where: {
          table_command,
          company_id,
          status: 'pending'
        }
      })
      // Localiza a maxima posição nas filas de músicas
      const maxPositionResult = await Songs.findAll({
        attributes: [
           sequelize.fn('MAX', sequelize.col('position')),
        ],
        raw: true,
        where: { company_id, status: 'pending' }
      })
      // Localiza a menor posição nas filas de músicas
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
          table_number,
        }
      })

      //REGRA PARA COMANDA JA CANTOU
      const allApprovedSongs = await Songs.findAll({
        where: {
          company_id,
          table_command,
          status: 'approved'
        }
      })
      
      if(allApprovedSongs.length > 0) {
        console.log('if 1 -  COMANDA JA CANTOU')
        const findAllCommandSongs = await Songs.findAll({
          where: {
            company_id,
            table_command: table_command,
            status: ['pending', 'approved']
          },
          attributes: [
            sequelize.fn('MAX', sequelize.col('round_id')),
          ],
          raw: true
        });

        const songsofRoundId = await Songs.findAll({
          where: {
            company_id,
            round_id: findAllCommandSongs[0]['MAX(`round_id`)'] + 1,
            status: ['pending'],
          },
          attributes: [
            sequelize.fn('MAX', sequelize.col('position')),
          ],
          raw: true
        });

        if (songsofRoundId.length > 0 && songsofRoundId[0]['MAX(`position`)']) {
          console.log('1.1 - EXISTE MUSICAS NA RODADA: '.concat(findAllCommandSongs[0]['MAX(`round_id`)'] + 1));
          let initialRoundPendingMaxPosition = songsofRoundId[0]['MAX(`position`)'];
          const allPendingRoundSongs = await Songs.findAll({
            where: {
              company_id,
              status: 'pending'
            },
            raw: true
          });
          // LACO PARA ATUALIZAÇÃO DE POSIÇÕES
          for await (const song of allPendingRoundSongs) {
            const songToUpdate = await Songs.findOne({ where: { company_id, position: song.position } })
            if (songToUpdate.status == 'pending' && songToUpdate.position >= initialRoundPendingMaxPosition) {
              const newPosition = songToUpdate.position + 1
              await songToUpdate.update({position: newPosition});
              await songToUpdate.save();
            }
          }

          const song = await Songs.create({
            table_command,
            table_number,
            song_name,
            artist_name,
            status: 'pending',
            position: initialRoundPendingMaxPosition,
            company_id,
            active: 1,
            waiting_time: 60,
            round_id: findAllCommandSongs[0]['MAX(`round_id`)'] + 1,
            date_song: today
          });
  
          io.emit('updateSong', "Nova música cadastrada")
  
          return res.status(201).json({
            title: 'Música cadastrada com sucesso',
            song
          })
          
        } else {
          console.log('IF 1.2 - ELSE CONDITION')
          // Verifica se existe rodada com o ID informado.
          const existRoundId = await RoundSongs.findOne({where: {id: findAllCommandSongs[0]['MAX(`round_id`)'] + 1}});
          if (!existRoundId) {
            console.log('entrou')
            await RoundSongs.create({
              active: 0,
              company_id
            });
          }
  
          const song = await Songs.create({
            table_command,
            table_number,
            song_name,
            artist_name,
            status: 'pending',
            position: maxPositionResult[0]['MAX(`position`)'] + 1,
            company_id,
            active: 1,
            waiting_time: 60,
            round_id: findAllCommandSongs[0]['MAX(`round_id`)'] + 1,
            date_song: today
          });
  
          io.emit('updateSong', "Nova música cadastrada")
  
          return res.status(201).json({
            title: 'Música cadastrada com sucesso',
            song
          })
        }
      }
      
      // REGRA PARA QUANDO NAO TEM COMANDA E MESA
      if (!songCommand && songTable.length == 0 || table_number == 99) {
        console.log('if 2')
        // ATUALIZA AS POSICOES E INSERE A COMANDA NA 3 POSIÇÃO DE MUSICAS QUE JA CANTARAM
        const allSongs = await Songs.findAll({
          where: {
            company_id,
            status: ['approved', 'pending']
          },
          raw: true
        });

        let initialPendingPosition;
        let updateSongs = 0
        let has3position = 0
        let songRoundId;
        let hasNoApprovedCommand = 0
        let arrayInitialPositions = [];
        let getCurrentRound = await RoundSongs.findOne({ 
          where: { company_id, active: 1 },
        });
       
        for await (const verifySong of allSongs) {
          if (verifySong.position >= 3) {
            console.log('2.1 - ENTROU IF')
            if (verifySong.status == 'pending') {
              console.log('2.2 - ENTROU IF')

              // console.log(verifySong.table_command)
              // SELECIONA TODAS AS MUSICAS APROVADAS DA COMANDA
              const approvedCommandSong = await Songs.findOne({
                where: {
                  company_id,
                  table_command: verifySong.table_command,
                  status: 'approved'
                },
                raw: true 
              })
              // CASO EXISTA MUSICAS APROVADAS
              if (approvedCommandSong) {
                // console.log('COMANDA APROVADA E PENDENTE', approvedCommandSong);
                
                if (verifySong.table_command == approvedCommandSong.table_command) {
                  initialPendingPosition = verifySong.position;
  
                  // console.log('POSIÇÃO APPROVED', initialPendingPosition);
                  const song = await Songs.findOne({ where: { company_id, position: verifySong.position } })
                  if (song.status == 'pending' && song.position >= initialPendingPosition) {
                    const newPosition = song.position + 1
                    console.log('initialPendingPosition', initialPendingPosition)
                    console.log('LOG POSITIONS', {
                      'song position': song.position,
                      'newPosition': newPosition
                    })
                    await song.update({position: newPosition});
                    await song.save();
                  }
  
                  arrayInitialPositions.push(initialPendingPosition);
                }
              } else {
                console.log("ENTROU ELSE")
                has3position = 1
                const song = await Songs.findOne({ 
                  where: { company_id, round_id: getCurrentRound.id },
                  attributes: [
                    sequelize.fn('MAX', sequelize.col('position')),
                  ],
                  raw: true
                });
                
                if (verifySong.status == 'pending') {
                  const songMaxRoundId = await Songs.findOne({
                    where: {
                      company_id,
                      table_command
                    },
                    attributes: [
                      sequelize.fn('MAX', sequelize.col('round_id')),
                    ],
                    raw: true
                  });
      
                  const roundId = await RoundSongs.findOne({
                    where: {
                      company_id,
                      id: songMaxRoundId['MAX(`round_id`)'] + 1
                    }
                  });
      
                  if (!roundId) {
                    await RoundSongs.create({
                      active: 0,
                      company_id
                    });
                  }
      
                  songRoundId = songMaxRoundId['MAX(`round_id`)'] + 1
                  initialPendingPosition = verifySong.position;
                  arrayInitialPositions.push(initialPendingPosition);
                }
                
              }

            }
          } else {
            console.log('2 - ENTROU ELSE')
            has3position = 1
            const songMaxRoundId = await Songs.findOne({
              where: {
                company_id,
                table_command
              },
              attributes: [
                sequelize.fn('MAX', sequelize.col('round_id')),
              ],
              raw: true
            });

            if (!songMaxRoundId['MAX(`round_id`)']) {
              const roundId = await RoundSongs.findOne({
                where: {
                  company_id,
                  active: 1
                }
              });

              if(roundId) {
                songRoundId = roundId.id
              }

              const getMaxRoundPosition = await Songs.findOne({
                where: {
                  company_id,
                  round_id: songRoundId
                },
                attributes: [
                  sequelize.fn('MAX', sequelize.col('position')),
                ],
                raw: true
              });

              initialPendingPosition = getMaxRoundPosition['MAX(`position`)'] - 1;
              updateSongs = 1
              arrayInitialPositions.push(initialPendingPosition);
            } else {
              const roundId = await RoundSongs.findOne({
                where: {
                  company_id,
                  id: songMaxRoundId['MAX(`round_id`)'] + 1
                }
              });
  
              if (!roundId) {
                await RoundSongs.create({
                  active: 0,
                  company_id
                });
              }  
              songRoundId = songMaxRoundId['MAX(`round_id`)'] + 1
              initialPendingPosition = verifySong.position;
              arrayInitialPositions.push(initialPendingPosition);
            }
          }

          // if (verifySong.status == 'pending' && verifySong.status == 'approved') {
          //   if (verifySong.status == 'pending') {
          //     initialPendingPosition = verifySong.position;
          //   }
          // }
        }
        //ADICIONA A NOVA MUSICA
        if (has3position == 0) {
          const song = await Songs.create({
            table_command,
            table_number,
            song_name,
            artist_name,
            status: 'pending',
            position: initialPendingPosition ?  Math.min.apply(Math, arrayInitialPositions) : minPositionResult[0]['MIN(`position`)'] + 2, // Position 3
            company_id,
            active: 1,
            waiting_time: 60,
            round_id: active_round_id,
            date_song: today
          });

          io.emit('updateSong', "Nova música cadastrada")
          arrayInitialPositions = []
          return res.status(201).json({
            title: 'Música cadastrada com sucesso',
            song
          })
        } else {
          console.log('NOT 3 POSITION', Math.max.apply(Math, arrayInitialPositions) + 1)

          if (updateSongs) {
            for await (const verifySong of allSongs) {
              const song = await Songs.findOne({ where: { company_id, position: verifySong.position } })
              if (song.status == 'pending' && song.position >= initialPendingPosition + 1) {
                const newPosition = song.position + 1
                console.log('initialPendingPosition', initialPendingPosition)
                console.log('LOG CREATE NEW SONG POSITIONS', {
                  'song name': song_name,
                  'song position': Math.max.apply(Math, arrayInitialPositions) + 1
                });


                console.log('LOG POSITIONS', {
                  'song name': song.song_name,
                  'song position': song.position,
                  'newPosition': newPosition
                })
                
                await song.update({position: newPosition}, {where: {id: song.id}});
                await song.save();
              }
            }
          }
          const song = await Songs.create({
            table_command,
            table_number,
            song_name,
            artist_name,
            status: 'pending',
            position: Math.max.apply(Math, arrayInitialPositions) + 1,
            company_id,
            active: 1,
            waiting_time: 60,
            round_id: songRoundId,
            date_song: today
          });
          arrayInitialPositions = []
          io.emit('updateSong', "Nova música cadastrada")
          
          has3position = false
          return res.status(201).json({
            title: 'Música cadastrada com sucesso',
            song
          })
        }

        // for await (const songs of findSongs) {
        //   if (songs.position >= 3 && songs.status == 'pending') {
        //     const song = await Songs.findOne({ where: { company_id, position: songs.position } })
        //     if (song.status == 'pending' && song.position >= 3) {
        //       const newPosition = song.position + 1
        //       await song.update({position: newPosition});
        //       await song.save();
        //     }
        //   }
        // } 
        // //ADICIONA A NOVA MUSICA
        // const song = await Songs.create({
        //   table_command,
        //   table_number,
        //   song_name,
        //   artist_name,
        //   status: 'pending',
        //   position: minPositionResult[0]['MIN(`position`)'] + 2, // Position 3
        //   company_id,
        //   active: 1,
        //   waiting_time: 60,
        //   round_id: active_round_id,
        //   date_song: today
        // });

        // io.emit('updateSong', "Nova música cadastrada")

        // return res.status(201).json({
        //   title: 'Música cadastrada com sucesso',
        //   song
        // })
      }
      if (findSongs.length > 0) {
        console.log('if 3')
        // Existe comanda em aberto e esta com status pendente
        if (songCommand && songCommand.status == "pending") {
          console.log('if 4')

          const findAllCommandSongs = await Songs.findAll({
            where: {
              table_command: table_command,
              status: ['pending', 'approved']
            },
            attributes: [
              sequelize.fn('MAX', sequelize.col('round_id')),
            ],
            raw: true
          });
          // Verifica se existe rodada com o ID informado.
          const existRoundId = await RoundSongs.findOne({where: {id: findAllCommandSongs[0]['MAX(`round_id`)'] + 1}});
          if (!existRoundId) {
            console.log('entrou')
            await RoundSongs.create({
              active: 0,
              company_id
            });
          }

          // VEDRFICA SE EXISTE MESA
          if (songTable.length > 0) {
            console.log('if 5')

            const songsofRoundId = await Songs.findAll({
              where: {
                company_id,
                round_id: findAllCommandSongs[0]['MAX(`round_id`)'] + 1,
                status: ['pending'],
              },
              attributes: [
                sequelize.fn('MAX', sequelize.col('position')),
              ],
              raw: true
            });

            if (songsofRoundId[0]['MAX(`position`)']) {
              console.log('5.1 - EXISTE MUSICAS NA RODADA: '.concat(findAllCommandSongs[0]['MAX(`round_id`)'] + 1));
              let initialRoundPendingMaxPosition = songsofRoundId[0]['MAX(`position`)'];
              const allPendingRoundSongs = await Songs.findAll({
                where: {
                  company_id,
                  status: 'pending'
                },
                raw: true
              });
              // LACO PARA ATUALIZAÇÃO DE POSIÇÕES
              for await (const song of allPendingRoundSongs) {
                const songToUpdate = await Songs.findOne({ where: { company_id, position: song.position } })
                if (songToUpdate.status == 'pending' && songToUpdate.position >= initialRoundPendingMaxPosition) {
                  const newPosition = songToUpdate.position + 1
                  await songToUpdate.update({position: newPosition});
                  await songToUpdate.save();
                }
              }

              const song = await Songs.create({
                table_command,
                table_number,
                song_name,
                artist_name,
                status: 'pending',
                position: initialRoundPendingMaxPosition,
                company_id,
                active: 1,
                waiting_time: 60,
                round_id: findAllCommandSongs[0]['MAX(`round_id`)'] + 1,
                date_song: today
              });
  
              io.emit('updateSong', "Nova música cadastrada")
  
              return res.status(201).json({
                title: 'Música cadastrada com sucesso',
                song
              })
            } else {
              console.log('ENTROU ELSE 5')
              const maxPosition = await Songs.findAll({
                where: {
                  company_id,
                  status: ['pending'],
                },
                attributes: [
                  sequelize.fn('MAX', sequelize.col('position')),
                ],
                raw: true
              });

              console.log(maxPosition[0]['MAX(`position`)'] + 1)

              const song = await Songs.create({
                table_command,
                table_number,
                song_name,
                artist_name,
                status: 'pending',
                position: maxPosition[0]['MAX(`position`)'] + 1,
                company_id,
                active: 1,
                waiting_time: 60,
                round_id: findAllCommandSongs[0]['MAX(`round_id`)'] + 1,
                date_song: today
              });
  
              io.emit('updateSong', "Nova música cadastrada")
  
              return res.status(201).json({
                title: 'Música cadastrada com sucesso',
                song
              })
            }
          }
        }
        // REGRA QUANDO COMANDA NAO CANTOU
        if (!songCommand) {
          console.log('if 6')
          // Verifica se mesa ja tem musica
          console.log('if 6 song table - ', songTable)
          if (songTable.length > 0 && songTable.status !== 'canceled' || songTable.status !== 'approved') {
            console.log('if 7')
            // ATUALIZA AS POSICOES
            for (const songs of findSongs) {
              if (songs.position >= 3 && songs.status == 'pending') {
                const newPosition = songs.position + 1
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
              waiting_time: 60,
              round_id: active_round_id,
              date_song: today
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

const findNextRoundForSongs = async (table_command, company_id) => {
  
};