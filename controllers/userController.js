const User = require("../model/userModel");

//* get all users.
exports.getUsers = async (req, res) => {
  try {
    //* get all books with object of category.
    const fetchedUsers = await User.find();

    res.status(200).json({
      response: true,
      results: fetchedUsers.length,
      data: fetchedUsers,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};
