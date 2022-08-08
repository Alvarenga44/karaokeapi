const express = require('express');
const multer = require('multer')

const multerConfig = require('./config/multer')
// Admin | Menagement Models
const AuthController = require('./controllers/AuthController');
const RolesController = require('./controllers/RolesController');
const MasterCompanyController = require('./controllers/MasterCompanyController');
const UsersController = require('./controllers/UsersController');
const VehiclesController = require('./controllers/VehiclesController');

const auth = require('./middleware/auth');

const routes = express.Router();

routes.get('/', (res) => {
  return res.json({ msg: 'ShareWay API Online' });
});

// Auth

routes.post('/v1/auth', AuthController.store);

// Auth Routes
routes.get('/v1/roles', auth, RolesController.index);
routes.get('/v1/roles/:id', auth, RolesController.show);
routes.post('/v1/roles', auth, RolesController.create);
routes.put('/v1/roles/:id', auth, RolesController.update);
routes.delete('/v1/roles/:id', auth, RolesController.delete);

// MasterCompanies
routes.get('/v1/mastercompanies', auth, MasterCompanyController.index);
routes.get('/v1/mastercompanies/:id', auth, MasterCompanyController.show);
routes.post('/v1/mastercompanies', auth, MasterCompanyController.store);
routes.put('/v1/mastercompanies/:id', auth, multer(multerConfig).single('file'), MasterCompanyController.update);
routes.delete('/v1/mastercompanies/:id', auth, MasterCompanyController.delete);

// Users
routes.get('/v1/users', auth, UsersController.index);
routes.get('/v1/users/:id', auth, UsersController.show);
routes.post('/v1/users', auth, UsersController.store);
routes.put('/v1/users/:id', auth, UsersController.update);
routes.delete('/v1/users/:id', auth, UsersController.delete);

// Vehicles
routes.get('/v1/vehicle', auth, VehiclesController.index);
routes.get('/v1/vehicle/:id', auth, VehiclesController.show);
routes.post('/v1/vehicle', auth, VehiclesController.store);
routes.put('/v1/vehicle/:id', auth, VehiclesController.update);
routes.delete('/v1/vehicle/:id', auth, VehiclesController.delete);

module.exports = routes;
