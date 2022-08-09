const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Tokens = require('../src/models/Tokens')
const Roles = require('../src/models/Roles');
const MasterCompany = require('../src/models/MasterCompany');
const Users = require('../src/models/Users');
const Vehicle = require('../src/models/Vehicle');
const Scheduler = require('../src/models/Scheduler');
const ImageProducts = require('../src/models/ImageProducts');

const connection = new Sequelize(dbConfig);

Tokens.init(connection);
Roles.init(connection);
MasterCompany.init(connection);
Users.init(connection);
Vehicle.init(connection);
Scheduler.init(connection);

Roles.associate(connection.models);
MasterCompany.associate(connection.models);
Users.associate(connection.models);
Vehicle.associate(connection.models);
// Scheduler.associate(connection.models);

module.exports = connection;