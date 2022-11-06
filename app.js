const express = require("express");

const cartRoutes = require("./routes/cart");
const couponRoutes = require("./routes/coupon");
const indexRoute = require("./routes/index");
const sequelize = require("./util/database");
const errorHandler = require("./middlewares/error-handler");

const app = express();

app.use(express.json());

app.use(indexRoute);
app.use(cartRoutes);
app.use(couponRoutes);

app.use(errorHandler);

sequelize
    .sync()
    .then(result => {
        // console.log(result);
        app.listen(3000);
    })
    .catch(error => {
        console.log(error);
    });
