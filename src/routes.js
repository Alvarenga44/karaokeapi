const express = require('express');

const AuthController = require('./controllers/AuthController');
const RolesController = require('./controllers/RolesController');
const MasterCompanyController = require('./controllers/MasterCompanyController');
const UsersController = require('./controllers/UsersController');
const CategoriesController = require('./controllers/CategoriesController');
const ProductsController = require('./controllers/ProductsController');

const auth = require('./middleware/auth');

const routes = express.Router();

routes.get('/', (req, res) => {
  return res.json({msg: 'API DigitalMenu Online'});
});

// Auth

routes.post('/v1/auth', AuthController.store);

// Roles
routes.get('/v1/roles', auth, RolesController.index);
routes.get('/v1/roles/:id', auth, RolesController.show);
routes.post('/v1/roles', auth, RolesController.create);
routes.put('/v1/roles/:id', auth, RolesController.update);
routes.delete('/v1/roles/:id', auth, RolesController.delete);

// MasterCompanies
routes.get('/v1/mastercompanies', auth, MasterCompanyController.index);
routes.get('/v1/mastercompanies/:id', auth, MasterCompanyController.show);
routes.post('/v1/mastercompanies', auth, MasterCompanyController.store);
routes.put('/v1/mastercompanies/:id', auth, MasterCompanyController.update);
routes.delete('/v1/mastercompanies/:id', auth, MasterCompanyController.delete);

// Users
routes.get('/v1/users', auth, UsersController.index);
routes.get('/v1/users/:id', auth, UsersController.show);
routes.post('/v1/users', auth, UsersController.store);
routes.put('/v1/users/:id', auth, UsersController.update);
routes.delete('/v1/users/:id', auth, UsersController.delete);

// Categories
routes.get('/v1/categories', auth, CategoriesController.index);
routes.get('/v1/categories/:id', auth, CategoriesController.show);
routes.post('/v1/categories', auth, CategoriesController.store);
routes.put('/v1/categories/:id', auth, CategoriesController.update);
routes.delete('/v1/categories/:id', auth, CategoriesController.delete);

// Products
routes.get('/v1/products', auth, ProductsController.index);
routes.get('/v1/products/:id', auth, ProductsController.show);
routes.post('/v1/products', auth, ProductsController.store);
routes.put('/v1/products/:id', auth, ProductsController.update);
routes.delete('/v1/products/:id', auth, ProductsController.delete);

module.exports = routes;
