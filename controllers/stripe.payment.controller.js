const { useAsync } = require("../core");
const { JParser } = require("../core").utils;
const stripeServices = require("../services/stripe.payment.service"); // Import the Stripe services
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key
const purchasedCourse = require("../models/PurchasedCourse");
const TransactionDetails = require("../models/transaction.details");
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
      transactionDetails,
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
      user_Id,
      transactionDetails
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

// New controller method to get transaction details by user ID
exports.getUserTransactionDetails = useAsync(async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Call service to fetch transaction details
    const transactionDetails =
      await stripeServices.getUserTransactionDetailsService(userId);

    return res.status(200).json(
      JParser("Transaction details fetched successfully", true, {
        transactionDetails,
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

  // Validate incoming request
  if (!req.rawBody) {
    console.error("No raw body found in request");
    return res.status(400).send("No raw body found in request");
  }

  // Verify Stripe signature
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

  // Log event for debugging
  console.log("Received webhook event:", event.type);

  // Extract session and metadata
  const session = event.data.object;
  const {
    userId,
    courseId,
    paymentSession,
    amount,
    transactionDetails,
  } = session.metadata;

  // Validate metadata
  if (!session.metadata) {
    console.error("No metadata found in session");
    return res.status(400).send("No metadata found in session");
  }

  const pasrsedTransactionDetails = JSON.parse(transactionDetails);
  // Prepare transaction entry
  const transactionEntry = {
    userId: userId,
    transactionAmount: amount || 0,
    transactionType: "",
    paymentStatus: "",
    billingAddress: pasrsedTransactionDetails?.billingAddress || null,
    transactionId: session.id,
  };


  // Handle event type
  try {
    switch (event.type) {
      case "checkout.session.completed":
        transactionEntry.paymentStatus = "success";

        if (paymentSession === "payFunds") {
          // Validate required fields
          transactionEntry.transactionType = "payfunds";
          if (!userId || !courseId) {
            console.error("Missing userId or courseId in session metadata");
            return res.status(400).send("Missing userId or courseId");
          }

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
        } else if (paymentSession === "withdrawFunds") {
          transactionEntry.transactionType = "withdrawFunds";

          console.log("Transfer funds logic executed");
        } else {
          if (userId) {
            transactionEntry.transactionType = "addfunds";
            const CurrentUserBalance = await usersServices.getUserBalanceById(
              userId
            );

            const total = parseFloat(CurrentUserBalance) + parseFloat(amount);
            console.log("CurrentUserBalance", total);
            const update = await usersServices.updateUserBalance(
              userId,
              total
            );
            if (!update) {
              console.error("Failed to update balance");
              return res.status(500).send("Failed to update balance");
            }
            console.log("Balance updated successfully");
          }
        }
        break;

      case "payment_intent.succeeded":
        transactionEntry.paymentStatus = "success";
        console.log("Payment succeeded:", session.id);
        break;

      case "payment_intent.payment_failed":
        transactionEntry.paymentStatus = "failed";
        console.log("Payment failed:", session.id);
        break;

      case "checkout.session.expired":
        transactionEntry.paymentStatus = "expired";
        console.log("Session expired:", session.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    // Save transaction details
    await TransactionDetails.create(transactionEntry);
    console.log("Transaction details saved successfully:", transactionEntry);

    return res.status(200).send("Webhook processed successfully");
  } catch (error) {
    console.error("Error processing webhook:", error);

    // Save failed transaction details
    transactionEntry.paymentStatus = "failed";
    await TransactionDetails.create(transactionEntry);
    console.log("Failed transaction details saved:", transactionEntry);

    return res.status(500).send("Internal Server Error");
  }
};

// exports.handleWebhook = async (req, res) => {
//   let event;

//   try {
//     const sig = req.headers["stripe-signature"];
//     event = stripe.webhooks.constructEvent(
//       req.rawBody,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }
//   // Log event to confirm it reaches the webhook
//   console.log("Received webhook event:", event.type);

//   const session = event.data.object;
//   const {
//     userId,
//     courseId,
//     paymentSession,
//     amount,
//     user_Id,
//     transactionDetails,
//   } = session.metadata;

//   const transactionEntry = {
//     userId: userId || user_Id,
//     transactionAmount: amount || 0,
//     transactionType: "payfunds",
//     paymentStatus: "",
//     billingAddress: transactionDetails?.billingAddress || null,
//     transactionId: session.id || null,
//   };

//   // Handle the event type
//   switch (event.type) {
//     case "checkout.session.completed":
//       transactionEntry.paymentStatus = "success";
//       if (paymentSession === "payFunds") {
//         if (!userId || !courseId) {
//           console.error("Missing userId or courseId in session metadata");
//           return res.status(400).send("Missing userId or courseId");
//         }

//         try {
//           // Check if the course is already purchased by the user
//           const existingPurchase = await purchasedCourse.findOne({
//             where: { userId, courseId },
//           });

//           if (!existingPurchase) {
//             // Add the course to the purchased_courses table
//             await purchasedCourse.create({ userId, courseId });
//             console.log("Course added to user's purchased courses:", courseId);
//           } else {
//             console.log(
//               "Course already exists in user's purchased courses:",
//               courseId
//             );
//           }

//           return res.status(200).send("Webhook processed successfully");
//         } catch (error) {
//           console.error("Error updating user's purchased courses:", error);
//           return res.status(500).send("Internal Server Error");
//         }
//       } else if (paymentSession === "transferFunds") {
//         console.log("LALALALALALALAL");
//       } else {
//         console.log(user_Id, "Idddddddd");
//         if (user_Id) {
//           try {
//             const CurrentUserBalance = await usersServices.getUserBalanceById(
//               id
//             );
//             const total = CurrentUserBalance + amount;

//             const update = await usersServices.updateUserBalance(
//               user_Id,
//               total
//             );
//             if (!update) {
//               console.error("Failed to update balance");
//               return res.status(500).send("Failed to update balance");
//             }
//             console.log("Balance updated successfully");
//             return res.status(200).send("Balance updated successfully");
//           } catch (error) {
//             console.error("Error updating balance:", error);
//             return res.status(500).send("Internal Server Error");
//           }
//         }
//       }

//       break;

//     case "payment_intent.succeeded":
//       transactionEntry.paymentStatus = "success";
//       console.log("Payment succeeded:", session.id);
//       break;

//     case "payment_intent.payment_failed":
//       transactionEntry.paymentStatus = "failed";
//       console.log("Payment failed:", session.id);
//       break;

//     case "checkout.session.expired":
//       transactionEntry.paymentStatus = "expired";
//       console.log("Session expired:", session.id);
//       break;

//     default:
//       console.log(`Unhandled event type: ${event.type}`);

//       // Store transaction details in the database
//       await TransactionDetails.create(transactionEntry);
//       console.log("Transaction details saved successfully:", transactionEntry);

//       return res.status(200).send("Webhook processed successfully");
//   }

//   res.status(200).send("Received webhook");
// };
