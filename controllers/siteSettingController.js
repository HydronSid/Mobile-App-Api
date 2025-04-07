const sliderModel = require("../model/sliderModel");
const multer = require("multer");
const sharp = require("sharp");
const factoryHandler = require("../controllers/factoryHandler.js");

exports.getSliderData = async (req, res) => {
  try {
    const sliders = await sliderModel.find();
    res.status(200).json({
      response: true,
      data: sliders,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

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

exports.uploadSliderPhoto = upload.single("slider");

exports.resizeSliderPhoto = async (req, res, next) => {
  console.log("req.file", req.file);

  if (!req.file) return next();

  req.file.filename = `slider-${Date.now()}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(1900, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/images/sliders/${req.file.filename}`);

    req.body.slider = req.file.filename;
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ response: false, error: "Image processing failed" });
  }
};
exports.createSliderData = async (req, res) => {
  try {
    const slider = await sliderModel.create({
      ...req.body,
      image: req.body.image || "default.jpg",
    });

    res.status(201).json({
      response: true,
      data: slider,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      response: false,
      error: error.message,
    });
  }
};

exports.updateSlider = factoryHandler.updateOne(sliderModel);
exports.deleteSlider = factoryHandler.deleteOne(sliderModel);
