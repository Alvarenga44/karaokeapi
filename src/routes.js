const express = require('express');
const multer = require('multer')

const multerConfig = require('./config/multer')
// Admin | Menagement Models
const AuthController = require('./controllers/AuthController');
const RolesController = require('./controllers/RolesController');
const MasterCompanyController = require('./controllers/MasterCompanyController');
const UsersController = require('./controllers/UsersController');
const SongsController = require('./controllers/SongsController');

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
routes.get('/v1/mastercompanies/:id', MasterCompanyController.show);
routes.post('/v1/mastercompanies', auth, MasterCompanyController.store);
routes.put('/v1/mastercompanies/:id', auth, multer(multerConfig).single('file'), MasterCompanyController.update);
routes.put('/v1/mastercompanies/:id/close', auth, MasterCompanyController.closeCompany);
routes.put('/v1/mastercompanies/:id/open', auth, MasterCompanyController.openCompany);
routes.delete('/v1/mastercompanies/:id', auth, MasterCompanyController.delete);

// Users
routes.get('/v1/users', auth, UsersController.index);
routes.get('/v1/users/:id', auth, UsersController.show);
routes.post('/v1/users', auth, UsersController.store);
routes.put('/v1/users/:id', auth, UsersController.update);
routes.delete('/v1/users/:id', auth, UsersController.delete);

routes.get('/v1/songs', auth, SongsController.index);
routes.get('/v1/songs/:id', auth, SongsController.show);
routes.post('/v1/songs/clientlist', SongsController.showClientSong);
routes.post('/v1/songs', SongsController.store);
routes.put('/v1/songs/:id', auth, SongsController.update);
routes.put('/v1/songs/cancel/:id', auth, SongsController.cancelMusic);
routes.delete('/v1/songs/:id', auth, SongsController.delete);

module.exports = routes;