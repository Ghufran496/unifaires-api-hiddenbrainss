const stripe = require("../config/stripe");

async function attachCardToCustomer(customerId, cardId, cardDetails) {
  try {
    let paymentMethodId = cardId;

    if (!cardId) {
      if (
        !cardDetails.cardNumber ||
        !cardDetails.cardName ||
        !cardDetails.cardCVC ||
        !cardDetails.cardExpMonth ||
        !cardDetails.cardExpYear
      ) {
        throw new Error("Incomplete card details");
      }

      const paymentMethod = await stripe.paymentMethods.create({
        type: "card",
        card: {
          number: cardDetails.cardNumber,
          exp_month: cardDetails.cardExpMonth,
          exp_year: cardDetails.cardExpYear,
          cvc: cardDetails.cardCVC,
        },
        billing_details: {
          name: cardDetails.cardName,
        },
      });

      if (!paymentMethod || !paymentMethod.id) {
        throw new Error("Failed to create payment method");
      }

      paymentMethodId = paymentMethod.id;
    }

    const existingPaymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    if (!existingPaymentMethods || !existingPaymentMethods.data) {
      throw new Error("Failed to retrieve existing payment methods");
    }

    const cardAlreadyAttached = existingPaymentMethods.data.some(
      (paymentMethod) => paymentMethod.id === paymentMethodId
    );

    if (!cardAlreadyAttached) {
      const attachment = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      if (!attachment || attachment.error) {
        throw new Error("Failed to attach payment method");
      }
    }

    return paymentMethodId;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  attachCardToCustomer,
};
