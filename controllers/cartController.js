const Cart = require("../model/cartModel.js");
const User = require("../model/userModel.js");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const factoryHandler = require("./factoryHandler.js");

const findUserByToken = async (req) => {
  token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  return await User.findById(decoded.id);
};

exports.getUserCart = async (req, res) => {
  try {
    var user = await findUserByToken(req);
    var fetchedCart = await Cart.find({ created_by: user._id }).populate([
      "book",
      "category",
    ]);

    res.status(200).json({
      response: true,
      results: fetchedCart.length,
      data: fetchedCart,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { book, category } = req.body;

    // 1) Get user from collection
    const user = await findUserByToken(req);
    const newCart = await Cart.create({
      book: book,
      category: category,
      created_by: user._id,
    });

    res.status(201).json({
      status: "success",
      data: {
        cart: newCart,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

exports.removeFromCart = factoryHandler.deleteOne(Cart);
