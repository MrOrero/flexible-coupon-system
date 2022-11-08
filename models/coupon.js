const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Coupon = sequelize.define("coupon", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    coupon_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    total_price_limit: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    total_item_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    discount_type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    discount_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = Coupon;
