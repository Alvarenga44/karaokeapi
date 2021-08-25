const express = require('express');

const RolesController = require('./controllers/RolesController');
const MasterCompanyController = require('./controllers/MasterCompanyController');
const UsersController = require('./controllers/UsersController');

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

// MasterCompanies
routes.get('/v1/mastercompanies', MasterCompanyController.index);
routes.get('/v1/mastercompanies/:id', MasterCompanyController.show);
routes.post('/v1/mastercompanies', MasterCompanyController.store);
routes.put('/v1/mastercompanies/:id', MasterCompanyController.update);
routes.delete('/v1/mastercompanies/:id', MasterCompanyController.delete);

// Users
routes.get('/v1/users', UsersController.index);
routes.get('/v1/users/:id', UsersController.show);
routes.post('/v1/users', UsersController.store);
routes.put('/v1/users/:id', UsersController.update);
routes.delete('/v1/users/:id', UsersController.delete);

module.exports = routes;
