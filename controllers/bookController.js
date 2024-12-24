const Book = require("../model/bookModel.js");
const Category = require("../model/categoryModel.js");
const factoryHandler = require("./factoryHandler.js");

//* get all category books.
exports.getRandomBooks = async (req, res) => {
  try {
    //* get all books with object of category.
    const fetchedBooks = await Book.find().populate("category");

    res.status(200).json({
      response: true,
      results: fetchedBooks.length,
      data: fetchedBooks,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

//* get specific category books.
exports.getBooksByCategory = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        response: false,
        error: "categoryId is required",
      });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        response: false,
        error: "Category not found",
      });
    }

    const fetchdBooks = await Book.find({ category: req.params.id }).populate(
      "category"
    );

    res.status(200).json({
      response: true,
      results: fetchdBooks.length,
      data: fetchdBooks,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

//* create book.
// exports.createBook = async (req, res) => {
//   try {
//     const book = new Book(req.body);
//     const newBook = await book.save();
//     res.status(201).json({ response: false, msg: "Book added succesfully." });
//   } catch (error) {
//     const statusCode = error.statusCode || 500;
//     res.status(statusCode).json({
//       response: false,
//       error: error.message,
//     });
//   }
// };

exports.createBook = factoryHandler.createOne(Book);
exports.updateBook = factoryHandler.updateOne(Book);
exports.deleteBook = factoryHandler.deleteOne(Book);
