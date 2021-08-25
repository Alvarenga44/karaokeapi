const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Tokens = require('../src/models/Tokens')
const Roles = require('../src/models/Roles');
const MasterCompany = require('../src/models/MasterCompany');
const Users = require('../src/models/Users');
const Categories = require('../src/models/Categories');
const Products = require('../src/models/Products');
const ImageProducts = require('../src/models/ImageProducts');

const connection = new Sequelize(dbConfig);

Tokens.init(connection);
Roles.init(connection);
MasterCompany.init(connection);
Users.init(connection);
Categories.init(connection);
Products.init(connection);
ImageProducts.init(connection);

Roles.associate(connection.models);
MasterCompany.associate(connection.models);
Users.associate(connection.models);
Categories.associate(connection.models);

module.exports = connection;