const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Roles = require('../src/models/Roles');
const MasterCompany = require('../src/models/MasterCompany');
const Users = require('../src/models/Users');
const Categories = require('../src/models/Categories');
const Products = require('../src/models/Products');
const ImageProducts = require('../src/models/ImageProducts');

const connection = new Sequelize(dbConfig);

Roles.init(connection);
MasterCompany.init(connection);
Users.init(connection);
Categories.init(connection);
Products.init(connection);
ImageProducts.init(connection);

module.exports = connection;