const stripe = require("../config/stripe");
class PaymentServices {
  async createCustomer(data) {
    return await stripe.customers.create(data);
  }

  async getAllCustomer() {
    return await stripe.customers.list();
  }

  async getCustomerByEmail(email) {
    return await stripe.customers.search({
      query: `email: "${email}"`,
    });
  }

  async updateCustomerDetails(id, data) {
    return await stripe.customers.update(id, data);
  }

  async getAllPayment() {
    return await Payment.findAll();
  }

  async getAllPaymentById(id) {
    return await Payment.findOne({ where: { id } });
  }

  async storePayment(req) {
    return await Payment.create(req.body);
  }

  async updatePayment(id, req) {
    return await Payment.update(req.body, { where: { id } });
  }

  async deletePayment(id) {
    return await Payment.destroy({ where: { id } });
  }

  async createStripeToken(data) {
    return await stripe.tokens.create({ card: data });
  }

  async addCardToCustomer({ customer_id, token_id }) {
    return await stripe.customers.createSource(customer_id, {
      source: token_id,
    });
  }

  async chargeStripeCustomer(data) {
    return await stripe.charges.create(data);
  }

  async allStripeCharges() {
    return await stripe.charges.list({});
  }

  // refunds
  async refundStripeCharge(chargeId) {
    return await stripe.refunds.create({
      charge: chargeId,
    });
  }

  async getAllRefundCharges() {
    return await stripe.refunds.list();
  }

  async verifyStripePayment(id) {
    return await stripe.charges.retrieve(id);
  }

  async getCustomerCards(customerId) {
    return await stripe.customers.retrieve(customerId, {
      expand: ["sources.data"],
    });
  }
  async searchStripeAccount(query) {
    return await stripe.customers.search({
      query,
    });
  }

  async addStripeCard({ number, exp_month, exp_year, cvc, customer }) {
    return await stripe.tokens.create({
      card: {
        number,
        exp_month,
        exp_year,
        cvc,
        customer,
      },
    });
  }

  async removeStripeCard(customerId, cardId) {
    return await stripe.customers.deleteSource(customerId, cardId);
  }

  async removeDefault(customerId) {
    return await stripe.customers.update(customerId);
  }
  async findStripeCard(customerID) {
    return await stripe.customers.listSources(customerID, {
      object: "card",
    });
  }

  async cancelSubscription(subscriptionId) {
    return await stripe.subscriptions.cancel(subscriptionId);
  }

  async getOrCreateCustomer(email, fullname) {
    const existingCustomer = await this.getCustomerByEmail(email);

    if (existingCustomer && existingCustomer.data.length > 0) {
      return existingCustomer.data[0];
    } else {
      const customerData = {
        email,
        name: fullname,
        // Add any other necessary customer details
      };

      const createdCustomer = await this.createCustomer(customerData);
      return createdCustomer;
    }
  }
}

module.exports = new PaymentServices();
