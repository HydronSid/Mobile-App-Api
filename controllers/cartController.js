const Cart = require("../model/cartModel.js");
const factoryHandler = require("./factoryHandler.js");
const userController = require("./userController.js");

exports.getUserCart = async (req, res) => {
  try {
    var user = await userController.findUserByToken(req);
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
    const user = await userController.findUserByToken(req);
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
