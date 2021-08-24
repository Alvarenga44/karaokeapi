const express = require('express');
const RolesController = require('./controllers/RolesController');

const routes = express.Router();

routes.get('/', (req, res) => {
  return res.json({msg: 'API DigitalMenu Online'});
});

// Roles
routes.get('/v1/roles', RolesController.index);
routes.get('/v1/roles/:id', RolesController.show);
routes.post('/v1/roles', RolesController.create);
routes.put('/v1/roles/:id', RolesController.update);
routes.delete('/v1/roles/:id', RolesController.delete);

module.exports = routes;
