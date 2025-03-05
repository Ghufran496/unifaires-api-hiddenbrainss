const { useAsync } = require("../core");
const { JParser } = require("../core").utils;
const flutterwaveServices = require("../services/flutterwavepay.service");
const TransactionDetails = require("../models/transaction.details");
const purchasedCourse = require("../models/PurchasedCourse");
const usersServices = require("../services/users.services");

exports.createFlutterwavePayment = useAsync(async (req, res, next) => {
  try {
    const {
      amount,
      user,
      courseId,
      paymentSession,
      transactionDetails,
      currency,
      calculatedAmount,
      country,
    } = req.body;

    const paymentLink =
      await flutterwaveServices.createFlutterwavePaymentService(
        amount,
        user,
        courseId,
        paymentSession,
        calculatedAmount,
        transactionDetails,
        currency,
        country
      );

    return res
      .status(200)
      .json(
        JParser("Flutterwave payment link created", true, { link: paymentLink })
      );
  } catch (error) {
    next(error);
  }
});

exports.handleFlutterwaveWebhook = async (req, res) => {
  try {
    await flutterwaveServices.handleFlutterwaveWebhookService(req);
    res.status(200).send("Webhook processed successfully");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.verifyFlutterwaveTransaction = useAsync(async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const transactionDetails =
      await flutterwaveServices.verifyFlutterwaveTransactionService(
        transactionId
      );
    res
      .status(200)
      .json(JParser("Transaction verified", true, transactionDetails));
  } catch (error) {
    next(error);
  }
});
