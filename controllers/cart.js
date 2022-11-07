const { validationResult } = require("express-validator");

const Cart = require("../models/cart");
const {
    format500error,
    formatCustomError,
    formatValidationError,
} = require("../util/format-error");
const { formatCartItems } = require("../util/format-cart");

exports.getCart = async (req, res, next) => {
    try {
        const products = await Cart.findAll({ attributes: ["item_name", "item_price"] });
        if (!products.length) {
            throw formatCustomError("No products in cart", 404);
        }
        const formatedProducts = formatCartItems(products);
        res.status(200).json({
            message: "Successful",
            data: formatedProducts,
        });
        return;
    } catch (error) {
        next(format500error(error));
        return error;
    }
};

exports.addtoCart = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(formatValidationError(errors.array()));
    }
    const { itemName, itemPrice } = req.body;
    try {
        const newItem = await Cart.findOne({ where: { item_name: itemName } });
        if (newItem !== null) {
            throw formatCustomError("This item already exists", 403);
        }
        await Cart.create({
            item_name: itemName,
            item_price: itemPrice,
        });
        const products = await Cart.findAll({ attributes: ["item_name", "item_price"] });
        const formatedProducts = formatCartItems(products);
        res.status(201).json({
            message: `${itemName} added succesfully`,
            data: formatedProducts,
        });
    } catch (error) {
        next(format500error(error));
        return error;
    }
};

exports.deleteCartItem = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(formatValidationError(errors.array()));
    }
    const { itemName } = req.params;
    try {
        const newItem = await Cart.findOne({ where: { item_name: itemName } });
        if (newItem === null) {
            throw formatCustomError("No such item", 404);
        }

        await Cart.destroy({ where: { item_name: itemName } });

        const products = await Cart.findAll({ attributes: ["item_name", "item_price"] });
        const formatedProducts = formatCartItems(products);
        res.status(200).json({
            message: `${itemName} deleted succesfully`,
            data: formatedProducts,
        });
        return;
    } catch (error) {
        next(format500error(error));
        return error;
    }
};
