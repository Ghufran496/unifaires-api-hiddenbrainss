const axios = require("axios");
const { FLUTTERWAVE_SECRET_TEST_KEY } = process.env;
const crypto = require("crypto");
const TransactionDetails = require("../models/transaction.details");
const purchasedCourse = require("../models/PurchasedCourse");
const usersServices = require("../services/users.services");

const createFlutterwavePaymentService = async (
  amount,
  user,
  courseId,
  paymentSession,
  calculatedAmount,
  transactionDetails,
  currency,
  country
) => {
  try {
    const transactionDetailsString = JSON.stringify(transactionDetails);
    const usersData = await usersServices.findOne(user.id);
    if (!usersData) {
      return res.status(404).json(JParser("User not found", false, null));
    }

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: Date.now().toString(),
        amount: calculatedAmount,
        currency: currency || "NGN",

        redirect_url: `${process.env.FRONT_APP_URL}/login?redirect=/user/payments`,
        customer: {
          email: usersData.email,
          name: user.username,
          dateofbirth: user.dateOfBirth,
        },
        meta: {
          userId: user?.id,
          courseId: courseId,
          paymentSession: paymentSession,
          amount: amount,
          transactionDetails: transactionDetailsString,
        },
        customizations: {
          title: "Course Payment",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_TEST_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", response);
    return response.data.data.link;
  } catch (error) {
    console.error("Error creating Flutterwave payment link:", error);
    throw new Error("Error creating Flutterwave payment link");
  }
};

const handleFlutterwaveWebhookService = async (req) => {
  try {
    const signature = req.headers["verif-hash"];
    // For testing/development, you might want to bypass signature verification
    // Remove this in production!
    if (process.env.NODE_ENV === "development") {
      console.log("Development mode: Skipping signature verification");
    } else {
      // Only verify signature in production
      if (!signature) {
        throw new Error("No signature found");
      }

      const expectedSignature = crypto
        .createHmac("sha512", process.env.FLUTTERWAVE_SECRET_HASH)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (signature !== expectedSignature) {
        throw new Error("Invalid signature");
      }
    }

    const payload = req.body;
    if (payload.event === "transfer.completed") {
      const eventType = payload.event;
      const transactionId = payload.data.id;
      const { userId, paymentSession, amount, currency } = payload.data.meta;

      const transactionEntry = {
        userId: userId,
        transactionAmount: amount || 0,
        transactionType: "",
        paymentStatus: "",
        billingAddress:
          {
            streetAddress: "Flutterwave-Withdraw",
            city: "Flutterwave-Withdraw",
            stateProvince: "Flutterwave-Withdraw",
            postalCode: "Flutterwave-Withdraw",
            country: "Flutterwave-Withdraw",
          } || null,
        transactionId: transactionId,
      };

      switch (eventType) {
        case "transfer.completed":
          transactionEntry.paymentStatus = "success";

          if (paymentSession === "withdrawFunds") {
            transactionEntry.transactionType = "withdrawfunds";
            // Get current user balance in USD
            const currentUserBalance = await usersServices.getUserBalanceById(
              userId
            );

            // Convert withdrawal amount from local currency to USD
            try {
              const response = await axios.get(
                `https://v6.exchangerate-api.com/v6/4d3f92caf2e2597b5fa17e02/latest/USD`
              );

              if (response.data && response.data.conversion_rates) {
                const rates = response.data.conversion_rates;
                const withdrawalAmountUSD = amount / rates[currency];

                // Calculate new balance after withdrawal
                const newBalance =
                  parseFloat(currentUserBalance) - withdrawalAmountUSD;

                transactionEntry.transactionAmount = withdrawalAmountUSD;
                // // Update user balance
                const update = await usersServices.updateUserBalance(
                  userId,
                  newBalance
                );
                if (!update) {
                  throw new Error("Failed to update balance after withdrawal");
                }

                console.log(
                  `Withdrawal processed: ${amount} ${currency} (${withdrawalAmountUSD} USD) from user ${userId}`
                );
              } else {
                throw new Error("Failed to get conversion rates");
              }
            } catch (error) {
              console.error("Error processing withdrawal conversion:", error);
              throw new Error("Failed to process withdrawal conversion");
            }
          }
          break;
        case "transfer.failed":
          transactionEntry.paymentStatus = "failed";
          console.log("Payment failed:", transactionId);
          break;
        default:
          console.log(`Unhandled event type: ${eventType}`);
      }

      await TransactionDetails.create(transactionEntry);
      console.log("Transaction details saved successfully:", transactionEntry);
    } else {
      const eventType = payload.event;
      const transactionId = payload.data.id;
      const { userId, courseId, paymentSession, amount, transactionDetails } =
        payload.meta_data;

      const pasrsedTransactionDetails = JSON.parse(transactionDetails);

      const transactionEntry = {
        userId: userId,
        transactionAmount: amount || 0,
        transactionType: "",
        paymentStatus: "",
        billingAddress: pasrsedTransactionDetails?.billingAddress || null,
        transactionId: transactionId,
      };

      switch (eventType) {
        case "charge.completed":
          transactionEntry.paymentStatus = "success";

          if (paymentSession === "payFunds") {
            transactionEntry.transactionType = "payfunds";
            if (!userId || !courseId) {
              throw new Error("Missing userId or courseId in session metadata");
            }

            const existingPurchase = await purchasedCourse.findOne({
              where: { userId, courseId },
            });

            if (!existingPurchase) {
              await purchasedCourse.create({ userId, courseId });
              console.log(
                "Course added to user's purchased courses:",
                courseId
              );
            } else {
              console.log(
                "Course already exists in user's purchased courses:",
                courseId
              );
            }
          } else if (paymentSession === "withdrawFunds") {
            transactionEntry.transactionType = "withdrawfunds";
          } else {
            if (userId) {
              transactionEntry.transactionType = "addfunds";
              const CurrentUserBalance = await usersServices.getUserBalanceById(
                userId
              );
              const total = parseFloat(CurrentUserBalance) + parseFloat(amount);
              const update = await usersServices.updateUserBalance(
                userId,
                total
              );
              if (!update) {
                throw new Error("Failed to update balance");
              }
              console.log("Balance updated successfully");
            }
          }
          break;
        case "charge.failed":
          transactionEntry.paymentStatus = "failed";
          console.log("Payment failed:", transactionId);
          break;
        default:
          console.log(`Unhandled event type: ${eventType}`);
      }

      await TransactionDetails.create(transactionEntry);
      console.log("Transaction details saved successfully:", transactionEntry);
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    throw error;
  }
};

const verifyFlutterwaveTransactionService = async (transactionId) => {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_TEST_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Transaction verification error:", error);
    throw error;
  }
};

const fetchBanksService = async (countryCode) => {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/banks/${countryCode}`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_TEST_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Bank fetching error:", error);
    throw error;
  }
};

const initiateFlutterwaveWithdrawal = async (
  userId,
  bankCode,
  accountNumber,
  amount,
  currency,
  amountToBeTransferred
) => {
  try {
    const user = await usersServices.findOne(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const transactionDetails = {
      userId,
      transactionAmount: amountToBeTransferred,
      transactionType: "withdrawfunds",
      paymentStatus: "pending",
      billingAddress: {
        streetAddress: "Flutterwave-Withdraw",
        city: "Flutterwave-Withdraw",
        stateProvince: "Flutterwave-Withdraw",
        postalCode: "Flutterwave-Withdraw",
        country: "Flutterwave-Withdraw",
      },
      currency: currency || "NGN",
    };

    const transactionDetailsString = JSON.stringify(transactionDetails);

    // Generate reference with test suffix for success after 1 minute
    //for testing purposes
    const testReference = `withdraw_${Date.now()}_PMCKDU_1`;

    const response = await axios.post(
      "https://api.flutterwave.com/v3/transfers",
      {
        account_bank: bankCode,
        account_number: accountNumber,
        amount: amountToBeTransferred,
        currency: currency || "NGN",
        narration: "Withdrawal from account",
        beneficiary_name: user.username,
        reference: testReference,
        meta: {
          userId: userId,
          bankCode: bankCode,
          accountNumber: accountNumber,
          amount: amount,
          currency: currency || "NGN",
          paymentSession: "withdrawFunds",
          amountToBeTransferred: amountToBeTransferred,
          currency: currency || "NGN",
          transactionDetails: transactionDetailsString,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_TEST_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status !== "success") {
      throw new Error("Withdrawal failed");
    }

    console.log("Withdrawal successful:", response.data.data);
    return response.data.data;
    // return "Withdrawal successful";
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    throw new Error("Error processing withdrawal");
  }
};

module.exports = {
  verifyFlutterwaveTransactionService,
  handleFlutterwaveWebhookService,
  createFlutterwavePaymentService,
  fetchBanksService,
  initiateFlutterwaveWithdrawal,
};
