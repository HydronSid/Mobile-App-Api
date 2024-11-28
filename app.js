const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const userRouter = require("./route/userRoutes.js");
const bookRouter = require("./route/bookRoutes.js");
const categoryRouter = require("./route/cartegoryRoutes.js");
const cartRouter = require("./route/cartRoute.js");
const wishlistRouter = require("./route/wiahlistRoute.js");

const app = express();

// ! Set Security HTTP Header
app.use(helmet());

//! Development login
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ! Limits,s requestes from same API
const limiter = rateLimit({
  max: 100,
  windowS: 60 * 60 * 1000,
  message: "To many requests from this IP.",
});

app.use("/api", limiter);

app.use(express.json());

app.use("/api/v1/users/", userRouter);
app.use("/api/v1/books/", bookRouter);
app.use("/api/v1/category/", categoryRouter);
app.use("/api/v1/cart/", cartRouter);
app.use("/api/v1/wishlist/", wishlistRouter);

module.exports = app;
