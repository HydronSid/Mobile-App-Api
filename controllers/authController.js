const User = require("../model/userModel.js");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const {
  validateSignUpData,
  validateSignInData,
  validateChangePassword,
} = require("../utils/validators.js");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    response: true,
    token,
    data: {
      user: user,
    },
  });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //! roles  : [ "user", "author", "admin"]. role= 'user'
    if (!roles.includes(req.user.role)) {
      // return next(
      //   new AppError("you do not have permission to perform this action.", 403)
      // );
      return res.status(403).json({
        response: false,
        error: error.message,
      });
    }

    next();
  };
};

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

    createSendToken(newUser, 201, res);
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
    const { email, password } = req.body;
    const errors = await validateSignInData(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        response: false,
        msg: "Validation Error",
        errors: errors,
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        response: false,
        msg: "Incorrect Email or password",
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        response: false,
        msg: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        response: false,
        msg: "Unauthorised access.",
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const errors = await validateChangePassword(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        response: false,
        msg: "Validation Error",
        errors: errors,
      });
    }

    // 1) Get user from collection
    const user = await User.findById(req.user.id).select("+password");

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.old_passsword, user.password))) {
      return res.status(401).json({
        response: false,
        msg: "Your current password is wrong.",
      });
    }

    // 3) If so, update password
    user.password = req.body.old_passsword;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};
