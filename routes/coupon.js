const express = require("express");

const couponController = require("../controllers/coupon");

const router = express.Router();

router.post("/coupon", couponController.useCoupon);

module.exports = router;
