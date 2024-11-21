const Category = require("../model/categoryModel.js");
const { validateCreateCategory } = require("../utils/validators.js");

exports.createCategory = async (req, res) => {
  try {
    const errors = await validateCreateCategory(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        response: false,
        msg: "Validation Error",
        errors: errors,
      });
    }

    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};
