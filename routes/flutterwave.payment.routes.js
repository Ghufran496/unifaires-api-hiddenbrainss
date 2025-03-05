const express = require("express");
const router = express.Router();
const {
  createFlutterwavePayment,
  handleFlutterwaveWebhook,
  verifyFlutterwaveTransaction,
  // ... other functions if needed
} = require("../controllers/flutterwavepay.controller");

router.post("/create-flutterwave-payment", createFlutterwavePayment);
router.post("/webhook", handleFlutterwaveWebhook);
router.get("/verify/:transactionId", verifyFlutterwaveTransaction);

module.exports = router;