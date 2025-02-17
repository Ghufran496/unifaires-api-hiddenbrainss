const express = require("express");
const router = express.Router();
const {
  createStripeSession,
  handlePaymentCallback,
  handleWebhook,
  getUserPurchasedCourses,
} = require("../controllers/stripe.payment.controller"); // New controller for Stripe

// Route to create a Stripe session for payment
router.post("/create-stripe-session", createStripeSession);

// Route to handle the payment callback after Stripe redirects
router.get("/payment-callback", handlePaymentCallback);

// Route to handle Stripe Webhook events
router.post("/webhook", handleWebhook);
//http://localhost:5001/api/v1/payment/webhook
// New route to get purchased courses by user ID
router.get("/user/:userId/purchased-courses", getUserPurchasedCourses);
module.exports = router;
