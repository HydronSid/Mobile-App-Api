const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: false,
  },
  subtitle: {
    type: String,
    trim: true,
    required: false,
  },
  slider: {
    type: String,
  },
  link: {
    type: String,
    trim: true,
    required: false,
  },
  position: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optional: hide __v when converting to JSON
sliderSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Slider", sliderSchema);
