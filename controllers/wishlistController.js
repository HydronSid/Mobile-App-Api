const WishList = require("../model/wishlistModel.js");
const factoryHandler = require("./factoryHandler.js");
const userController = require("./userController.js");

// const findUserByToken = async (req) => {
//   token = req.headers.authorization.split(" ")[1];
//   console.log(token);
//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//   return await User.findById(decoded.id);
// };

exports.getUserWishList = async (req, res) => {
  try {
    var user = await userController.findUserByToken(req);
    var fetchedWishList = await WishList.find({
      created_by: user._id,
    }).populate(["book", "category"]);

    res.status(200).json({
      response: true,
      results: fetchedWishList.length,
      data: fetchedWishList,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

exports.addToWishList = async (req, res) => {
  try {
    const { book, category } = req.body;

    // 1) Get user from collection
    const user = await userController.findUserByToken(req);
    const newWishList = await WishList.create({
      book: book,
      category: category,
      created_by: user._id,
    });

    res.status(201).json({
      status: "success",
      data: {
        wishlist: newWishList,
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

exports.removeFromWishList = factoryHandler.deleteOne(WishList);
