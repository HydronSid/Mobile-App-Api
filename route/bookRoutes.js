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
  .patch(
    authController.protect,
    authController.restrictTo("author"),
    bookController.uploadBookImage,
    bookController.resizeBookImages,
    bookController.updateBook
  )
  .delete(
    authController.protect,
    authController.restrictTo("author"),
    bookController.deleteBook
  );

module.exports = router;
