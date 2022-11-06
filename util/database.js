const { Sequelize } = require("sequelize");

// Option 1: Passing a connection URI
const sequelize = new Sequelize(process.env.MYSQL_URI);

module.exports = sequelize;
