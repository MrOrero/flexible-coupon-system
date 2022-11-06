const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Cart = sequelize.define("cart", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    itemName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    itemPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
});

module.exports = Cart;
