const express = require("express");
const wishListController = require("../controllers/wishlistController.js");
const router = express.Router();

router
  .route("/")
  .get(wishListController.getUserWishList)
  .post(wishListController.addToWishList);

router.route("/:id").delete(wishListController.removeFromWishList);

module.exports = router;
