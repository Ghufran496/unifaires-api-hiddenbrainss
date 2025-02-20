const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key
const purchasedCourse = require("../models/PurchasedCourse");
const TransactionDetails = require("../models/transaction.details");


// Service method for creating a Stripe session
const createStripeSessionService = async (
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
) => {
  try {
    const bankPaymentMethods = {
      "Stripe Germany Bank": ["sepa_debit", "sofort", "giropay"], // Germany
      "Stripe France Bank": ["sepa_debit"], // France
      "Stripe USA Bank": ["us_bank_account"], // USA (ACH Direct Debit)
      "Stripe Canada Bank": ["acss_debit"], // Canada (Interac, PADs)
      "Stripe Brazil Bank": ["boleto", "pix"], // Brazil
    };

    const allowedMethods =
      paymentMethod === "card" ? ["card"] : bankPaymentMethods[currency?.bank];

    console.log("allowedMethods", allowedMethods);

    const transactionDetailsString = JSON.stringify(transactionDetails);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: allowedMethods,
      line_items: [
        {
          price_data: {
            currency: currency.currency || "USD",
            product_data: {
              name: "Course Payment",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONT_APP_URL}/login?redirect=/user/payments`,
      cancel_url: `${process.env.FRONT_APP_URL}${redirectUrl}`,
      metadata: {
        userId: user?.id,
        courseId: courseId,
        paymentSession: paymentSession,
        amount: amount,
        user_Id: user_Id,
        transactionDetails: transactionDetailsString,
      },
    });

    return session.url; // Return the session URL for redirecting
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    throw new Error("Error creating Stripe session");
  }
};

// Service method for handling the Stripe payment callback
const handlePaymentCallbackService = async (session_id) => {
  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Payment was successful, handle success (e.g., update database)
      return { success: true, session };
    } else {
      // Payment failed
      return { success: false, session };
    }
  } catch (error) {
    console.error("Error handling payment callback:", error);
    throw new Error("Error handling payment callback");
  }
};

const getUserPurchasedCoursesService = async (userId) => {
  try {
    const purchasedCourses = await purchasedCourse.findAll({
      where: { userId },
      attributes: ["courseId"], // Only fetch course IDs
    });

    // Extract course IDs from the result
    const courseIds = purchasedCourses.map((course) => course.courseId);

    return courseIds;
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    throw new Error("Error fetching purchased courses");
  }
};

const deletePurchasedCourseService = async (userId, courseId) => {
  try {
    const result = await purchasedCourse.destroy({
      where: { userId, courseId },
    });

    return result; // Returns the number of rows deleted
  } catch (error) {
    console.error("Error deleting purchased course:", error);
    throw new Error("Error deleting purchased course");
  }
};


// Service to fetch transaction details by user ID
const getUserTransactionDetailsService = async (userId) => {
  try {
    const transactionDetails = await TransactionDetails.findAll({
      where: { userId },
      attributes: [
        "id",
        "transactionAmount",
        "paymentStatus",
        "transactionId",
        "transactionType",
        "createdAt",
        "updatedAt",
        "billingAddress",
      ], 
    });

    return transactionDetails;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    throw new Error("Error fetching transaction details");
  }
};

module.exports = {
  createStripeSessionService,
  handlePaymentCallbackService,
  getUserPurchasedCoursesService,
  deletePurchasedCourseService,
  getUserTransactionDetailsService
};
