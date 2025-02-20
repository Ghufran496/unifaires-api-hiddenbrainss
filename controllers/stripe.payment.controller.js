const { useAsync } = require("../core");
const { JParser } = require("../core").utils;
const stripeServices = require("../services/stripe.payment.service"); // Import the Stripe services
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key
const purchasedCourse = require("../models/PurchasedCourse");
const usersServices = require("../services/users.services");

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
      courseId,
      paymentSession,
      user_Id,
    } = req.body;

    // Call service to create Stripe session
    const sessionUrl = await stripeServices.createStripeSessionService(
      amount,
      currency,
      paymentMethod,
      user,
      selectedGateway,
      redirectUrl,
      courseId,
      paymentSession,
      user_Id
    );

    return res
      .status(200)
      .json(JParser("Stripe session created", true, { url: sessionUrl }));
  } catch (error) {
    next(error);
  }
});

// New controller method to get purchased courses by user ID
exports.getUserPurchasedCourses = useAsync(async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Call service to fetch purchased courses
    const purchasedCourses =
      await stripeServices.getUserPurchasedCoursesService(userId);

    return res.status(200).json(
      JParser("Purchased courses fetched successfully", true, {
        purchasedCourses,
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.deletePurchasedCourse = useAsync(async (req, res, next) => {
  try {
    const { userId, courseId } = req.params;

    // Call service to delete the purchased course
    const result = await stripeServices.deletePurchasedCourseService(
      userId,
      courseId
    );

    if (result) {
      return res
        .status(200)
        .json(JParser("Purchased course deleted successfully", true));
    } else {
      return res.status(404).json(JParser("Purchased course not found", false));
    }
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
      const session = event.data.object;
      const { userId, courseId, paymentSession, amount, user_Id } =
        session.metadata;
      if (paymentSession === "payFunds") {
        if (!userId || !courseId) {
          console.error("Missing userId or courseId in session metadata");
          return res.status(400).send("Missing userId or courseId");
        }

        try {
          // Check if the course is already purchased by the user
          const existingPurchase = await purchasedCourse.findOne({
            where: { userId, courseId },
          });

          if (!existingPurchase) {
            // Add the course to the purchased_courses table
            await purchasedCourse.create({ userId, courseId });
            console.log("Course added to user's purchased courses:", courseId);
          } else {
            console.log(
              "Course already exists in user's purchased courses:",
              courseId
            );
          }

          return res.status(200).send("Webhook processed successfully");
        } catch (error) {
          console.error("Error updating user's purchased courses:", error);
          return res.status(500).send("Internal Server Error");
        }
      } else if (paymentSession === "transferFunds") {
        console.log("LALALALALALALAL");
      } else {
        console.log(user_Id, "Idddddddd");
        if (user_Id) {
          try {
            console.log("inside");
            const CurrentUserBalance = await usersServices.getUserBalanceById(
              user_Id
            );

            const total = parseFloat(CurrentUserBalance) + parseFloat(amount);
            console.log("CurrentUserBalance", total);
            const update = await usersServices.updateUserBalance(
              user_Id,
              total
            );
            if (!update) {
              console.error("Failed to update balance");
              return res.status(500).send("Failed to update balance");
            }
            console.log("Balance updated successfully");
            return res.status(200).send("Balance updated successfully");
          } catch (error) {
            console.error("Error updating balance:", error);
            return res.status(500).send("Internal Server Error");
          }
        }
      }

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
