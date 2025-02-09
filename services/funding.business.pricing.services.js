const { FundingBusinessPricing } = require("../models");

class FundingBusinessPricingServices {
  async all() {
    return await FundingBusinessPricing.findAll();
  }
  async findOne(id) {
    return await FundingBusinessPricing.findOne({ where: { id } });
  }
  async findBy(by) {
    return await FundingBusinessPricing.findOne({ where: by });
  }

  async findAllBy(by) {
    return await FundingBusinessPricing.findOne({ where: by });
  }

  async store(req) {
    return await FundingBusinessPricing.create(req.body);
  }

  async update(id, req) {
    return await FundingBusinessPricing.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await FundingBusinessPricing.destroy({ where: { id } });
  }

  async findBy(by) {
    return await FundingBusinessPricing.findOne({ where: by });
  }
}

module.exports = new FundingBusinessPricingServices();
