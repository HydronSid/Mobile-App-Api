const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  author: { type: String, trim: true },
  genre: { type: [String], trim: true },
  description: { type: String, trim: true },
  price: { type: String, trim: true },
  publishedDate: { type: Date },
  imageCover: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  pages: { type: Number },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  // imageCover: {
  //   type: String,
  //   require: [true, "a book must have a image."],
  // },
  images: [String],
  language: { type: String, default: "English" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Book", bookSchema);
