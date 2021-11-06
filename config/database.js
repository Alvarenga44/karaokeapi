require('dotenv').config()
module.exports = {

  dialect: 'mysql',
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  define: {
    timestamps: true,
    underscored: true,
  }
};