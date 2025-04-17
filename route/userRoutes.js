const express = require("express");
const authController = require("../controllers/authController.js");
const userController = require("../controllers/userController.js");

const router = express.Router();

router.post("/signup", authController.signUp);

router.post("/signin", authController.signIn);
router.post(
  "/changePassword",
  authController.protect,
  authController.changePassword
);

router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.get("/", userController.getUsers);
router.get("/getProfileData", userController.getProfileData);

module.exports = router;
