const express = require("express");
const authController = require("../controllers/authController.js");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post(
  "/changePassword",
  authController.protect,
  authController.changePassword
);

module.exports = router;
