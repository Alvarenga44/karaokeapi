const Users = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authSecreat = require('../utils/authSecreat');

module.exports = {
  async store(req, res) {
    try {
      const { email, password } = req.body;

      console.log(email, password)
      const account = await Users.findOne({ email }, {
        include: [
          {
            all: true
          }
        ]
      });

      if (!account || !bcrypt.compareSync(password, account.password)) {
        return res.status(401).json({ message: 'Os dados informados estão incorretos' });
      } else {
        const token = jwt.sign({ userId: account.id, roles: account.roles, company: account.company }, `${authSecreat}`, { expiresIn: '24h' });
        return res.json({
          account,
          token
        })
      }
    } catch (error) {
      console.log(error);
      let e = [];
      e.push(error);
      return res.status(500).json({
        title: 'Falha na autenticação, tente novamente',
        e
      })
    }
  }
}