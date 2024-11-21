const Book = require("../model/bookModel.js");

exports.getRandomBooks = async (req, res) => {
  try {
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

exports.createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};
