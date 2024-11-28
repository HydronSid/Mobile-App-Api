const express = require("express");
const cartController = require("../controllers/cartController.js");
const router = express.Router();

router
  .route("/")
  .get(cartController.getUserCart)
  .post(cartController.addToCart);

router.route("/:id").delete(cartController.removeFromCart);

module.exports = router;
