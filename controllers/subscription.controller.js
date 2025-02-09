const { useAsync } = require("../core");
const { JParser } = require("../core").utils;

const subscriptionServices = require("../services/subscription.services");
const paymentServices = require("../services/payment.services");
const stripe = require("../config/stripe");
const subscriptionPlanServices = require("../services/subscription.plan.services");
const subscriptionCountryPricingServices = require("../services/subscription.country.pricing.services");

const {
  findProductByName,
  getActivePrice,
  updateProductPrice,
  createProduct,
  createPrice,
  createSubscription,
} = require("../helpers/subscription.helper");

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await subscriptionServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { planId, cardId, country } = req.body;

    // Validate the plan
    const plan = await subscriptionPlanServices.findOne(planId);
    if (!plan) {
      return res.status(400).json(JParser("Invalid plan", false, null));
    }

    // Get the customer's Stripe record
    const query = `email:'${req.user.email}'`;
    const search = await paymentServices.searchStripeAccount(query);
    if (!search || search.data.length === 0) {
      return res.status(400).json(JParser("Invalid card details", false, null));
    }
    const { id: customerId } = search.data[0];

    // Check if the card is already attached
    const existingPaymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });
    const cardAlreadyAttached = existingPaymentMethods.data.some(
      (paymentMethod) => paymentMethod.id === cardId
    );
    if (!cardAlreadyAttached) {
      await stripe.paymentMethods.attach(cardId, { customer: customerId });
    }

    // Find the price from the database
    const price = await subscriptionPlanServices.findOne(planId);
    if (!price) {
      return res
        .status(400)
        .json(JParser("Invalid pricing passed", false, null));
    }

    // Calculate the discount based on the user's country
    const countryPricing = await subscriptionCountryPricingServices.findBy({
      country,
    });
    const discount = countryPricing ? countryPricing.discount : 0;
    const discountedPrice = price.price - (price.price * discount) / 100;

    // Find or create the product
    const productName = price.title + req.user.email;
    const products = await findProductByName(productName);
    let product =
      products.length > 0 ? products[0] : await createProduct(productName);

    // Get or create the active price
    let activePrice = await getActivePrice(product.id);

    if (!activePrice) {
      activePrice = await createPrice(product.id, discountedPrice);
    } else if (
      parseFloat(activePrice.unit_amount_decimal) !==
      parseFloat(discountedPrice) * 100
    ) {
      activePrice = await updateProductPrice(activePrice, {
        price: discountedPrice,
      });
    }

    // Create the subscription
    const subscription = await createSubscription(
      customerId,
      activePrice.id,
      req
    );
    return res.status(201).json(JParser("ok-response", true, subscription));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await subscriptionServices.findOne(id);

    if (!subscription) {
      return res.status(404).json(JParser("not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, subscription));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await subscriptionServices.findOne(id);

    if (!subscription) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await subscriptionServices.update(id, req);

    if (update) {
      const subscription = await subscriptionServices.findOne(id);

      return res
        .status(200)
        .json(JParser("subscription updated successfully", true, subscription));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await subscriptionServices.findOne(id);

    if (!subscription) {
      return res.status(404).json(JParser("ok-response", false, null));
    }

    const destroy = await subscriptionServices.update(id, req);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_subscription = useAsync(async (req, res, next) => {
  try {
    let idField = null;

    if (req.user) {
      idField = req.user.id;
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;

      idField = req.business.id;
    }

    if (idField) {
      const columnToUse = req.user ? "userId" : "businessId";

      const query = { [columnToUse]: idField };

      const subscription = await subscriptionServices.findBy(query);

      if (!subscription) {
        return res
          .status(404)
          .json(JParser("you have no subscription at the moment", false, null));
      }

      return res.status(200).json(JParser("ok-response", true, subscription));
    }
  } catch (error) {
    next(error);
  }
});

exports.change_subscription = useAsync(async (req, res, next) => {
  try {
    let idField = null;

    if (req.user) {
      idField = req.user.id;
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;

      idField = req.business.id;
    }

    if (idField) {
      const columnToUse = req.user ? "userId" : "businessId";

      const query = { [columnToUse]: idField };

      const subscription = await subscriptionServices.findBy(query);

      if (!subscription) {
        return res
          .status(404)
          .json(JParser("you have no subscription at the moment", false, null));
      }

      return res.status(200).json(JParser("ok-response", true, subscription));
    }
  } catch (error) {
    next(error);
  }
});

exports.remove_subscription = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check if subscription is valid
    const isSubscribe = await subscriptionServices.findOne(id);

    if (!isSubscribe) {
      return res
        .status(404)
        .json(JParser("subscription not found", false, null));
    }

    const { subscriptionId } = isSubscribe;

    let idField = null;

    if (req.user) {
      idField = req.user.id;
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;

      idField = req.business.id;
    }

    if (idField) {
      const columnToUse = req.user ? "userId" : "businessId";

      const query = { [columnToUse]: idField };

      const stripeSubscription = await stripe.subscriptions.retrieve(
        subscriptionId
      );

      if (
        stripeSubscription.status === "canceled" ||
        stripeSubscription.status === "incomplete" ||
        stripeSubscription.status === "incomplete_expired"
      ) {
        return res
          .status(400)
          .json(JParser("subscription is already inactive", false, null));
      }

      const unsubscribe = await paymentServices.cancelSubscription(
        subscriptionId
      );

      if (!unsubscribe) {
        return res
          .status(400)
          .json(JParser("something went wrong", false, null));
      }

      const update = await subscriptionServices.update(id, {
        body: {
          query,
          subscriptionId,
          status: false,
        },
      });

      if (update) {
        return res.status(200).json(JParser("ok-response", true, null));
      }
    }
  } catch (error) {
    next(error);
  }
});
