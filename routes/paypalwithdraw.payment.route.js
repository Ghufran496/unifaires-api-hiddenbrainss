const express = require("express");
const router = express.Router();
const {
  initiateWithdrawal,
  getPayPalClientId,
  handlePaypalWebhook,
} = require("../controllers/paypalwithdraw.controller"); // New controller for PayPal

// Route to initiate a PayPal withdrawal
router.post("/withdraw", initiateWithdrawal);

// Optional: Route to get PayPal Client ID (for frontend if needed for connection flow)
router.get("/clientid", getPayPalClientId);

// PayPal Webhook endpoint - MUST be POST and use raw body middleware
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handlePaypalWebhook
);

module.exports = router;