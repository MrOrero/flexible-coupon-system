const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Cart = sequelize.define("cart", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    item_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    item_price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
});

module.exports = Cart;
