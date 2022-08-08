const Users = require('../models/Users');

module.exports = {
  async index(res) {
    try {
      const users = await Users.findAndCountAll({
        where: { active: 1 },
        include: [
          {
            all: true
          }
        ]
      });

      return res.status(200).json({
        users
      })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir usuário, tente novamente',
        e
      })
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const users = await Users.findByPk(id, { include: { all: true } });

      return res.status(200).json(users)
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir usuário, tente novamente',
        e
      })
    }
  },

  async store(req, res) {
    try {
      const { company_id, role_id } = req.headers;
      const {
        name,
        email,
        is_driver,
        password
      } = req.body;

      const [users, created] = await Users.findOrCreate({
        where: { email },
        defaults: {
          name,
          email,
          password,
          is_driver,
          company_id,
          role_id,
          active: 1
        }
      });

      return res.status(201).json({
        title: 'Usuário cadastrada com sucesso',
        created,
        users
      })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir usuário, tente novamente',
        e
      })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        is_driver,
        password,
        active,
        role_id,
        company_id
      } = req.body;

      const users = await Users.update({
        name,
        email,
        password,
        is_driver,
        active,
        role_id,
        company_id
      }, {
        where: {
          id
        }
      });

      return res.status(200).json({ msg: 'Usuário atualizado com sucesso', users })
    } catch (error) {
      console.log(error)
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir usuário, tente novamente',
        e
      })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const users = await Users.destroy({ where: { id } });

      return res.status(200).json({ msg: 'Usuário deletado com sucesso', users })
    } catch (error) {
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha ao inserir usuário, tente novamente',
        e
      })
    }
  },
}