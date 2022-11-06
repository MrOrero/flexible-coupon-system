const { body, param } = require("express-validator");

exports.addToCartValidation = () => {
    return [
        body("itemName", "Enter a valid itemName")
            .isAlpha()
            .withMessage("Item name must only be alphabets")
            .isLength({ min: 2, max: 20 })
            .withMessage("Item name must have a minimum of 2 alphabets and maximum of 20")
            .ltrim()
            .rtrim(),
        body("itemPrice", "Please enter a valid lastname")
            .isNumeric()
            .withMessage("Price must be numeric")
            .notEmpty()
            .withMessage("please provide a Price")
            .ltrim()
            .rtrim(),
    ];
};

exports.delteCartItemValidation = () => {
    return [
        param("itemName", "Enter a valid itemName")
            .isAlpha()
            .withMessage("Item name must have only be alphabets")
            .isLength({ min: 2, max: 20 })
            .withMessage("Item name must have a minimum of 2 alphabets and maximum of 20")
            .ltrim()
            .rtrim(),
    ];
};
