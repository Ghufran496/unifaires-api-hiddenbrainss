const { SubscriptionTransaction } = require("../models");

class SubscriptionTransactionServices {
  async all() {
    return await SubscriptionTransaction.findAll();
  }
  async findOne(id) {
    return await SubscriptionTransaction.findOne({ where: { id } });
  }
  async store(req) {
    return await SubscriptionTransaction.create(req.body);
  }
  async update(id, req) {
    return await SubscriptionTransaction.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await SubscriptionTransaction.destroy({ where: { id } });
  }
}

module.exports = new SubscriptionTransactionServices();
