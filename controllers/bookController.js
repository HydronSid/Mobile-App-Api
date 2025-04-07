const Book = require("../model/bookModel.js");
const Category = require("../model/categoryModel.js");
const factoryHandler = require("./factoryHandler.js");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      res.status(400).json({
        response: false,
        error: "Not an Image! Please Upload only images.",
      }),
      false
    );
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadBookImage = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeBookImages = async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  //! 1) Cover Image

  req.body.imageCover = `book-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/books/${req.body.imageCover}`);

  //! 1) Images

  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `book-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 2200)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/books/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
};

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
