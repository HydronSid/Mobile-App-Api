const express = require("express");

const bookController = require("../controllers/bookController.js");
const router = express.Router();

router
  .route("/")
  .get(bookController.getRandomBooks)
  .post(bookController.createBook);

// router.route("/:id").get(bookController.getSpecificBook);

module.exports = router;
