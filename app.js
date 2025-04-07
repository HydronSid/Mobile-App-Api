const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const userRouter = require("./route/userRoutes.js");
const bookRouter = require("./route/bookRoutes.js");
const categoryRouter = require("./route/cartegoryRoutes.js");
const cartRouter = require("./route/cartRoute.js");
const wishlistRouter = require("./route/wishlistRoute.js");
const siteSettingsRouter = require("./route/siteSettingsRoutes.js");
const cors = require("cors");

const app = express();

// ! Set Security HTTP Header
app.use(helmet());
app.use(cors());

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
app.use("/api/v1/siteSettings/", siteSettingsRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    response: false,
    error: err.message,
  });
});

module.exports = app;
