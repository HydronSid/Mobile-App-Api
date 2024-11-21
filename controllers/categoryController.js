const Category = require("../model/categoryModel.js");
const { validateCreateCategory } = require("../utils/validators.js");

//* get all categories.
exports.getCategories = async (req, res) => {
  try {
    var fetchedCategories = await Category.find();

    res.status(200).json({
      response: true,
      results: fetchedCategories.length,
      data: fetchedCategories,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

//* get all category by id.
exports.getCategoryById = async (req, res) => {
  try {
    var category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        response: false,
        error: "No Catagory found.",
      });
    }

    res.status(200).json({
      response: true,
      category: category,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

//* create category.
exports.createCategory = async (req, res) => {
  try {
    const errors = await validateCreateCategory(req.body, Category);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        response: false,
        msg: "Validation Error",
        errors: errors,
      });
    }

    const newCategory = await Category.create(req.body);
    res.status(201).json({
      response: false,
      msg: "category added succesfully.",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

//* delete category.
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404).json({
        response: false,
        error: "No Catagory found.",
      });
    }

    res.status(204).json({
      status: "Deleted Successfully",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};
