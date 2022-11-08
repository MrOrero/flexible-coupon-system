const express = require("express");

const cartController = require("../controllers/cart");
const { addToCartValidation, delteCartItemValidation } = require("../validation/cart-validation");

const router = express.Router();

router.get("/cart", cartController.getCart);

router.post("/cart", addToCartValidation(), cartController.addtoCart);

router.delete("/cart/:itemName", delteCartItemValidation(), cartController.deleteCartItem);

module.exports = router;
