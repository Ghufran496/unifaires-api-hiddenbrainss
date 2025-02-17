const express = require("express");
const router = express.Router();
const {
  createStripeSession,
  handlePaymentCallback,
  handleWebhook,
} = require("../controllers/stripe.payment.controller"); // New controller for Stripe

// Route to create a Stripe session for payment
router.post("/create-stripe-session", createStripeSession);

// Route to handle the payment callback after Stripe redirects
router.get("/payment-callback", handlePaymentCallback);

// Route to handle Stripe Webhook events
router.post("/webhook", handleWebhook);
//http://localhost:5001/api/v1/payment/webhook
module.exports = router;
