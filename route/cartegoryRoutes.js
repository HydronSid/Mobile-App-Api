const express = require("express");
const categoryController = require("../controllers/categoryController.js");
const router = express.Router();

router
  .route("/")
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategoryById)
  .delete(categoryController.deleteCategory);

module.exports = router;
