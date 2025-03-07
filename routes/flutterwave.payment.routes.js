const express = require("express");
const router = express.Router();
const {
  createFlutterwavePayment,
  handleFlutterwaveWebhook,
  verifyFlutterwaveTransaction,
  fetchBanks,
  initiateWithdrawal,
  // ... other functions if needed
} = require("../controllers/flutterwavepay.controller");

router.post("/create-flutterwave-payment", createFlutterwavePayment);
router.post("/webhook", handleFlutterwaveWebhook);
router.get("/verify/:transactionId", verifyFlutterwaveTransaction);
router.get("/banks/:countryCode", fetchBanks);
router.post("/withdraw", initiateWithdrawal);


module.exports = router;