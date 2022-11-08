const fs = require("fs");
const path = require("path");

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const cartRoutes = require("./routes/cart");
const couponRoutes = require("./routes/coupon");
const indexRoute = require("./routes/index");
const sequelize = require("./util/database");
const errorHandler = require("./middlewares/error-handler");

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());

app.use("/api", indexRoute);
app.use("/api", cartRoutes);
app.use("/api", couponRoutes);

app.use(errorHandler);

sequelize
    .sync()
    .then(() => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(error => {
        console.log(error);
    });
