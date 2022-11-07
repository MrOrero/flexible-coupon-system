const { Sequelize } = require("sequelize");

// Option 1: Passing a connection URI
let sequelize;
if (process.env.NODE_ENV === "test") {
    sequelize = new Sequelize(process.env.MYSQL_URI_TEST, {
        dialect: "mysql",
    });
} else {
    sequelize = new Sequelize(process.env.MYSQL_URI, {
        dialect: "mysql",
    });
}

module.exports = sequelize;
