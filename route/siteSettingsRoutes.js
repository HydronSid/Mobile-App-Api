const express = require("express");
const router = express.Router();
const siteSettingController = require("../controllers/siteSettingController.js");
const authController = require("../controllers/authController.js");

router
  .get("/getSliderData", siteSettingController.getSliderData)
  .post(
    "/createSlider",
    authController.protect,
    authController.restrictTo("admin"),
    siteSettingController.uploadSliderPhoto,
    siteSettingController.resizeSliderPhoto,
    siteSettingController.createSliderData
  )
  .delete(
    "/deleteSlider/:id",
    authController.protect,
    authController.restrictTo("admin"),
    siteSettingController.deleteSlider
  )
  .patch(
    "/updateSlider/:id",
    authController.protect,
    authController.restrictTo("admin"),
    siteSettingController.uploadSliderPhoto,
    siteSettingController.resizeSliderPhoto,
    siteSettingController.updateSlider
  );

module.exports = router;
