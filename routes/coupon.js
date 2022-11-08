const express = require("express");

const couponController = require("../controllers/coupon");
const { addCouponValidation } = require("../validation/coupon-validation");

const router = express.Router();

router.get("/coupon", couponController.getCoupon);

router.post("/coupon", couponController.useCoupon);

router.delete("/coupon/:couponName", couponController.deleteCoupon);

router.post("/coupon/create", addCouponValidation(), couponController.addCoupon);

module.exports = router;
