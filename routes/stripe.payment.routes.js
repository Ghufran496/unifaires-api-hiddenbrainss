const express = require("express");
const router = express.Router();
const {
  createStripeSession,
  handlePaymentCallback,
  handleWebhook,
  getUserPurchasedCourses,
  deletePurchasedCourse,
  getUserTransactionDetails,
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

// New route to delete a purchased course by user ID and course ID
router.delete(
  "/user/:userId/purchased-courses/:courseId",
  deletePurchasedCourse
);

// New route to get transaction details by user ID
router.get("/user/:userId/transaction-details", getUserTransactionDetails);

module.exports = router;
