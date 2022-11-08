const { body } = require("express-validator");

exports.addCouponValidation = () => {
    return [
        body("couponName", "Enter a valid coupon name")
            .isAlphanumeric()
            .withMessage("coupon name must only be alphabets or numbers")
            .isLength({ min: 5, max: 20 })
            .withMessage("coupon name must have a minimum of 5 alphabets and maximum of 20")
            .ltrim()
            .rtrim(),
        body("rules.totalPriceLimit", "Please enter a valid price")
            .isNumeric()
            .withMessage("Price must be numeric")
            .notEmpty()
            .withMessage("please provide a Price")
            .ltrim()
            .rtrim(),
        body("rules.totalItemLimit", "Please enter a valid number for total items")
            .isNumeric()
            .withMessage("total items must be numeric")
            .notEmpty()
            .withMessage("please provide a value for total items")
            .ltrim()
            .rtrim(),
        body("discount.type", "Please enter a valid discount type")
            .isAlpha()
            .withMessage("discount type must only be alphabets ")
            .isLength({ min: 5, max: 20 })
            .withMessage("coupon name must have a minimum of 5 alphabets and maximum of 20")
            .ltrim()
            .rtrim()
            .custom(value => {
                if (
                    value.toUpperCase() !== "FIXED" &&
                    value.toUpperCase() !== "PERCENT" &&
                    value.toUpperCase() !== "MIXED" &&
                    value.toUpperCase() !== "REJECTED"
                ) {
                    throw new Error("Invalid discount type");
                }
                return true;
            }),
        body("discount.amount", "Please enter a valid discount amount")
            .isNumeric()
            .withMessage("discount amount must be numeric")
            .notEmpty()
            .withMessage("please provide a value for discount amount")
            .ltrim()
            .rtrim(),
    ];
};
