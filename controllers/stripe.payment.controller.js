const { useAsync } = require("../core");
const { JParser } = require("../core").utils;
const stripeServices = require("../services/stripe.payment.service"); // Import the Stripe services
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key

// Create Stripe Checkout Session
exports.createStripeSession = useAsync(async (req, res, next) => {
  try {
    const {
      amount,
      currency,
      paymentMethod,
      user,
      selectedGateway,
      redirectUrl,
    } = req.body;

    // Call service to create Stripe session
    const sessionUrl = await stripeServices.createStripeSessionService(
      amount,
      currency,
      paymentMethod,
      user,
      selectedGateway,
      redirectUrl
    );

    return res
      .status(200)
      .json(JParser("Stripe session created", true, { url: sessionUrl }));
  } catch (error) {
    next(error);
  }
});

// Handle Stripe Payment Callback
exports.handlePaymentCallback = useAsync(async (req, res, next) => {
  try {
    const { session_id } = req.query;

    // Call service to handle payment callback
    const paymentResult = await stripeServices.handlePaymentCallbackService(
      session_id
    );

    if (paymentResult.success) {
      return res
        .status(200)
        .json(JParser("Payment successful", true, paymentResult.session));
    } else {
      return res
        .status(400)
        .json(JParser("Payment failed", false, paymentResult.session));
    }
  } catch (error) {
    next(error);
  }
});

exports.handleWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // Log event to confirm it reaches the webhook
  console.log("Received webhook event:", event.type);
  // Handle the event type
  switch (event.type) {
    case "checkout.session.completed":
      console.log("Payment Successful:", event.data.object);
      // Call your service to update database, mark order as paid, etc.
      break;

    case "payment_intent.succeeded":
      console.log("Payment Intent Succeeded:", event.data.object);
      break;

    case "payment_intent.payment_failed":
      console.log("Payment Failed:", event.data.object);
      break;

    case "checkout.session.expired":
      console.log("Session Expired:", event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).send("Received webhook");
};
