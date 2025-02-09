const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "./upload" });
const { store } = require("../controllers/media.controller");

router.post("/", upload.single("media"), store);

module.exports = router;
