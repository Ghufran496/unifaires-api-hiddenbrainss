const { SubscriptionCountryPricing } = require("../models");

class SubscriptionCountryPricingsServices {
  async all() {
    return await SubscriptionCountryPricing.findAll();
  }
  async findOne(id) {
    return await SubscriptionCountryPricing.findOne({ where: { id } });
  }
  async findBy(by) {
    return await SubscriptionCountryPricing.findOne({ where: by });
  }

  async findAllBy(by) {
    return await SubscriptionCountryPricing.findOne({ where: by });
  }

  async store(req) {
    return await SubscriptionCountryPricing.create(req.body);
  }

  async update(id, req) {
    return await SubscriptionCountryPricing.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await SubscriptionCountryPricing.destroy({ where: { id } });
  }

  async findBy(by) {
    return await SubscriptionCountryPricing.findOne({ where: by });
  }
}

module.exports = new SubscriptionCountryPricingsServices();
