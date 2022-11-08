const { validationResult } = require("express-validator");

const Coupon = require("../models/coupon");
const Cart = require("../models/cart");
const {
    format500error,
    formatCustomError,
    formatValidationError,
} = require("../util/format-error");
const formatQuery = require("../util/format-query");
const { calculateTotalPrice, formatCartItems } = require("../util/format-cart");

exports.getCoupon = async (req, res, next) => {
    try {
        //get all coupons from database
        const rows = await Coupon.findAll({
            attributes: [
                "coupon_name",
                "total_price_limit",
                "total_item_limit",
                "discount_type",
                "discount_amount",
            ],
        });
        //check if there are coupons in db
        if (!rows.length) {
            throw formatCustomError("There are no coupons", 404);
        }
        const coupons = formatQuery(rows);
        res.status(200).json({
            message: "Successful",
            data: coupons,
        });
        return;
    } catch (error) {
        next(format500error(error));
        return error;
    }
};

exports.addCoupon = async (req, res, next) => {
    //Function creates a coupon based on rules and discount type
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(formatValidationError(errors.array()));
    }
    const { couponName, rules, discount } = req.body;
    try {
        //Check if Coupon name already exists
        const existingCoupon = await Coupon.findOne({ where: { coupon_name: couponName } });
        //If coupon exists throw an error
        if (existingCoupon !== null) {
            throw formatCustomError("This coupon already exists", 403);
        }
        await Coupon.create({
            coupon_name: couponName.toUpperCase(),
            total_price_limit: rules.totalPriceLimit,
            total_item_limit: rules.totalItemLimit,
            discount_type: discount.type.toUpperCase(),
            discount_amount: discount.amount,
        });
        res.status(201).json({
            message: `${couponName} created succesfully`,
        });
    } catch (error) {
        next(format500error(error));
        return error;
    }
};

exports.deleteCoupon = async (req, res, next) => {
    const { couponName } = req.params;
    try {
        //Check if coupon exists
        const existingCoupon = await Coupon.findOne({ where: { coupon_name: couponName } });
        if (existingCoupon === null) {
            throw formatCustomError("No such coupon", 404);
        }

        //delete coupon from table
        await Coupon.destroy({ where: { coupon_name: couponName } });

        //get updated coupons
        const rows = await Coupon.findAll({
            attributes: [
                "coupon_name",
                "total_price_limit",
                "total_item_limit",
                "discount_type",
                "discount_amount",
            ],
        });
        const coupons = formatQuery(rows);
        res.status(200).json({
            message: `${couponName} deleted succesfully`,
            data: coupons,
        });
        return;
    } catch (error) {
        next(format500error(error));
        return error;
    }
};

exports.useCoupon = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(formatValidationError(errors.array()));
    }
    const { couponName } = req.body;
    try {
        //Check if Coupon name  exists
        const existingCoupon = await Coupon.findOne({
            attributes: [
                "coupon_name",
                "total_price_limit",
                "total_item_limit",
                "discount_type",
                "discount_amount",
            ],
            where: { coupon_name: couponName.toUpperCase() },
        });
        //If coupon doesn't exist throw an error
        if (existingCoupon === null) {
            throw formatCustomError("This coupon does not exist", 404);
        }

        //convert query result to javascript object
        const coupon = formatQuery(existingCoupon);

        const { count, rows } = await Cart.findAndCountAll({
            attributes: ["item_name", "item_price"],
        });
        const cart = formatQuery(rows);

        //get total price in cart
        const totalPrice = calculateTotalPrice(cart);

        //switch case to calculate discount bases on discount type
        let discount;
        let formattedCart;
        let newCart;
        switch (coupon.discount_type.toUpperCase()) {
            //calculation if discount type is fixed
            case "FIXED":
                // check if items in cart is less than total item limit
                if (+count < +coupon.total_item_limit) {
                    throw formatCustomError(
                        `Cart must contain at least ${coupon.total_item_limit} item`,
                        422
                    );
                }
                // check if total price is greater than total price limit
                if (+totalPrice < +coupon.total_price_limit) {
                    throw formatCustomError(
                        `Cart total price must be greater than $${coupon.total_price_limit}, current price is $${totalPrice}`,
                        422
                    );
                }
                // Calculate discount for fixed discount type
                discount = +totalPrice - +coupon.discount_amount;
                formattedCart = formatCartItems(cart);
                newCart = [...formattedCart];

                res.status(201).json({
                    message: `${couponName.toUpperCase()} applied succesfully, You have a $${
                        coupon.discount_amount
                    } discount`,
                    data: newCart,
                    discount: {
                        total_adjusted_price: discount,
                        discount_amount: coupon.discount_amount,
                    },
                });
                break;
            case "PERCENT":
                if (+count < +coupon.total_item_limit) {
                    throw formatCustomError(
                        `Cart must contain at least ${coupon.total_item_limit} item`,
                        422
                    );
                }
                if (+totalPrice < +coupon.total_price_limit) {
                    throw formatCustomError(
                        `Cart total price must be greater than $${coupon.total_price_limit}, current price is $${totalPrice}`,
                        422
                    );
                }
                // Calculate discount for percent discount
                var percent = +totalPrice * (+coupon.discount_amount / 100);
                discount = +totalPrice - percent;
                formattedCart = formatCartItems(cart);
                newCart = [...formattedCart];

                res.status(201).json({
                    message: `${couponName.toUpperCase()} applied succesfully, You have a %${
                        coupon.discount_amount
                    } discount which amounts to $${percent}`,
                    data: newCart,
                    discount: {
                        total_adjusted_price: discount,
                        discount_amount: percent,
                    },
                });
                break;
            case "MIXED":
                if (+count < +coupon.total_item_limit) {
                    throw formatCustomError(
                        `Cart must contain at least ${coupon.total_item_limit} item`,
                        422
                    );
                }
                if (+totalPrice < +coupon.total_price_limit) {
                    throw formatCustomError(
                        `Cart total price must be greater than $${coupon.total_price_limit}, current price is $${totalPrice}`,
                        422
                    );
                }

                // Calculate for both fixed and percent and check which discount is higher
                var fixed = +totalPrice - +coupon.discount_amount;
                var perc = +totalPrice * (+coupon.discount_amount / 100);
                var percent = +totalPrice - perc;
                formattedCart = formatCartItems(cart);
                if (+fixed < +percent) {
                    newCart = [...formattedCart];
                    return res.status(201).json({
                        message: `${couponName.toUpperCase()} applied succesfully, You have a $${
                            coupon.discount_amount
                        } discount`,
                        data: newCart,
                        discount: {
                            total_adjusted_price: fixed,
                            discount_amount: coupon.discount_amount,
                        },
                    });
                }
                if (+percent < +fixed) {
                    newCart = [...formattedCart];
                    return res.status(201).json({
                        message: `${couponName.toUpperCase()} applied succesfully, You have a %${
                            coupon.discount_amount
                        } discount which amounts to $${perc}`,
                        data: newCart,
                        discount: { total_adjusted_price: percent, discount_amount: perc },
                    });
                }
                if (percent === fixed) {
                    newCart = [...formattedCart];
                    return res.status(201).json({
                        message: `${couponName.toUpperCase()} applied succesfully`,
                        data: newCart,
                        discount: {
                            total_adjusted_price: percent,
                            discount_amount: coupon.discount_amount,
                        },
                    });
                }
                break;
            case "REJECTED":
                if (+count < +coupon.total_item_limit) {
                    throw formatCustomError(
                        `Cart must contain at least ${coupon.total_item_limit} item`,
                        422
                    );
                }
                if (+totalPrice < +coupon.total_price_limit) {
                    throw formatCustomError(
                        `Cart total price must be greater than $${coupon.total_price_limit}, current price is $${totalPrice}`,
                        422
                    );
                }
                // Calculate for both fixed and percent
                var fixed = +totalPrice - +coupon.discount_amount;
                var perc = +totalPrice * (+coupon.discount_amount / 100);
                var percent = +totalPrice - perc;
                formattedCart = formatCartItems(cart);
                newCart = [...formattedCart];

                res.status(201).json({
                    message: `${couponName.toUpperCase()} applied succesfully, you have a $${
                        coupon.discount_amount
                    } discount and a ${coupon.discount_amount} which amounts to $${perc}`,
                    data: newCart,
                    discount: {
                        total_adjusted_price_fixed: fixed,
                        discount_amount_fixed: coupon.discount_amount,
                        total_adjusted_price_percent: percent,
                        discount_amount_percent: perc,
                    },
                });
                break;
            default:
                throw formatCustomError("This coupon does not exist", 404);
        }
    } catch (error) {
        next(format500error(error));
        return error;
    }
};
