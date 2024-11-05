const User = require("../model/userModel.js");
const { validateSignUpData } = require("../utils/validators.js");

exports.signUp = async (req, res) => {
  try {
    const errors = await validateSignUpData(req.body, User);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        response: false,
        msg: "Validation Error",
        errors: errors,
      });
    }

    const newUser = await User.create(req.body);

    res.status(200).json({
      response: true,
      msg: "User created successfully.",
      user: newUser,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

exports.signIn = async (req, res) => {
  try {
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};
