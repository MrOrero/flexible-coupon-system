const express = require("express");

const sequelize = require("./util/database");
const cartRoutes = require("./routes/cart");
const couponRoutes = require("./routes/coupon");

const app = express();

app.use("/cart", cartRoutes);
app.use("/coupon", couponRoutes);

sequelize
    .sync()
    .then(result => {
        // console.log(result);
        app.listen(3000);
    })
    .catch(error => {
        console.log(error);
    });
