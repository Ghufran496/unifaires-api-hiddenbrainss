const dayjs = require("dayjs");

const stripe = require("../config/stripe");
const subscriptionServices = require("../services/subscription.services");
const subscriptionPlanServices = require("../services/subscription.plan.services");

async function findProductByName(productName) {
  const products = await stripe.products.list({ active: true });
  return products.data.filter((p) => p.name === productName);
}
async function getActivePrice(productId) {
  const prices = await stripe.prices.list({ product: productId });

  if (!prices.data.length) {
    return undefined;
  }

  const activePrice = prices.data.find((pricing) => pricing.active);

  if (!activePrice) {
    return undefined;
  }

  return activePrice;
}

async function updateProductPrice(existingPrice, newPrice) {
  if (!existingPrice) {
    throw new Error("Existing price is undefined upfsyr");
  }

  if (!existingPrice.product) {
    throw new Error(
      "Existing price does not have a product associated with it"
    );
  }

  const updatedPrice = await stripe.prices.create({
    product: existingPrice.product,
    unit_amount: parseFloat(newPrice.price) * 100,
    currency: existingPrice.currency,
    active: true,
    recurring: { interval: "month" },
  });

  await stripe.prices.update(existingPrice.id, { active: false });

  return updatedPrice;
}

async function createProduct(productName) {
  const product = await stripe.products.create({ name: productName });
  return product;
}

async function createPrice(productId, price) {
  const pricing = await stripe.prices.create({
    unit_amount: parseFloat(price) * 100,
    currency: "usd",
    recurring: { interval: "month" },
    product: productId,
  });
  return pricing;
}

async function createSubscription(customerId, priceId, req) {
  const { planId } = req.body;

  const subscriptionPlan = await subscriptionPlanServices.findOne(planId);

  if (!subscriptionPlan) {
    throw new Error("Subscription plan not found");
  }

  // Calculate the billing cycle anchor
  const durationDays = subscriptionPlan.durationDays;

  const billingCycleAnchor = dayjs().add(durationDays, "days").unix();

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    collection_method: "charge_automatically",
    trial_period_days: 0,
    billing_cycle_anchor: billingCycleAnchor,
    metadata: {
      userId: req.user.id,
      paidFor: "subscription",
      planId: planId,
    },
  });

  if (subscription) {
    const data = {
      subscriptionId: subscription.id,
      paymentDate: new Date(subscription.created * 1000),
      dueDate: new Date(subscription.current_period_end * 1000),
      userId: subscription.metadata.userId,
      platform: "stripe",
      planId: subscription.metadata.planId,
      status: true,
    };
    req.body = data;
    const transaction = await subscriptionServices.store(req);
    return transaction;
  }
}

module.exports = {
  findProductByName,
  getActivePrice,
  updateProductPrice,
  createProduct,
  createPrice,
  createSubscription,
};
