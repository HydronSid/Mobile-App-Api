const express = require("express");
const router = express.Router();
const wpController = require("../controllers/wpController.js");

router.post("/send-message", wpController.sendMessage);
router.post("/qr-image", wpController.getQrAsImage);
router.post("/qr-json", wpController.getQrAsJson);
router.get("/wp-status", wpController.getWhatsappStatus);
router.post("/send-wp-message", wpController.sendWpMessage);
router.post("/logout-wp-session", wpController.logout);
module.exports = router;
