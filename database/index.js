const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Tokens = require('../src/models/Tokens')
const Roles = require('../src/models/Roles');
const MasterCompany = require('../src/models/MasterCompany');
const Users = require('../src/models/Users');
const Songs = require('../src/models/Songs');
const RoundSongs  = require('../src/models/RoundSongs');

const connection = new Sequelize(dbConfig);

Tokens.init(connection);
Roles.init(connection);
MasterCompany.init(connection);
Users.init(connection);
Songs.init(connection);
RoundSongs.init(connection);


Roles.associate(connection.models);
MasterCompany.associate(connection.models);
Users.associate(connection.models);
Songs.associate(connection.models);
RoundSongs.associate(connection.models);

module.exports = connection;