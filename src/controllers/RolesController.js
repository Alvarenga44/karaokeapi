const Roles = require('../models/Roles');

module.exports = {
  async index(req, res) {
    try {
      const roles = await Roles.findAndCountAll();

      return res.json(roles);
    } catch (error) {
      return res.json(500).json({message: 'Falha ao listar permissões'})
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const role = await Roles.findOne({id});

      return res.json(role);
    } catch (error) {
      return res.json(500).json({message: 'Falha ao listar permissão'})
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body;
      const roles = await Roles.create({name});
      
      return res.json({message: 'Permissão criada com sucesso', roles});
    } catch (error) {
      return res.json(500).json({message: 'Falha ao criar permissões'})
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const verifyRole = await Roles.findOne({id})
      if (verifyRole.name === name && verifyRole.active === active) return res.status(405).json({msg: `A permissão ${name} já está cadastrada`, verifyRole})

      await Roles.update({name}, {where: {
        id
      }});    

      return res.json({ message: 'Permissão atualizada com sucesso' });
    } catch (error) {
      return res.json(500).json({message: 'Falha ao atualizar permissões'})
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await Roles.destroy({where: { id }});

      return res.json({message: 'Permissão deletada com sucesso'});
    } catch (error) {
      return res.json(500).json({message: 'Falha ao deletar permissões'})
    }
  },
}