const User = require("../model/userModel");
const multer = require("multer");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const findUserByToken = async (req) => {
  token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  return await User.findById(decoded.id);
};

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/image/users");
//   },
//   filename: async (req, file, cb) => {
//     console.log(req);
//     var user = await findUserByToken(req);
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${user._id}-${Date.now()}.${ext}`);
//   },
// });

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

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = async (req, res, next) => {
  try {
    if (!req.file) return next();

    req.file.filename = `user-${user._id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/images/users/${req.file.filename}`);

    next();
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

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

exports.getProfileData = async (req, res) => {
  try {
    var tokenUser = await findUserByToken(req);

    //* get all books with object of category.
    const user = await User.findOne({ _id: tokenUser._id });

    res.status(200).json({
      response: true,
      user,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

exports.updateMe = async (req, res) => {
  try {
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "name", "email");
    if (req.file) filteredBody.photo = req.file.filename;
    var user = await findUserByToken(req);
    const doc = await User.findByIdAndUpdate(user._id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};
