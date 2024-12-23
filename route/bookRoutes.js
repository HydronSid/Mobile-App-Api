const express = require("express");

const bookController = require("../controllers/bookController.js");
const authController = require("../controllers/authController.js");
const router = express.Router();

router
  .route("/")
  .get(bookController.getRandomBooks)
  .post(bookController.createBook);

router
  .route("/:id")
  .get(bookController.getBooksByCategory)
  .delete(
    authController.protect,
    authController.restrictTo("author"),
    bookController.deleteBook
  );

module.exports = router;
