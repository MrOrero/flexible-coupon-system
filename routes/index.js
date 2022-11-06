const express = require("express");

const couponController = require("../controllers/coupon");

const router = express.Router();

router.get("/", (req, res) => {
    res.status(201).json({
        message: `Welcome to flexible coupon system Api`,
    });
});

module.exports = router;
