const { AssociatePricing } = require("../models");

class AssociatePricingServices {
  async all() {
    return await AssociatePricing.findAll();
  }
  async findOne(id) {
    return await AssociatePricing.findOne({ where: { id } });
  }
  async store(req) {
    return await AssociatePricing.create(req.body);
  }
  async update(id, req) {
    return await AssociatePricing.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await AssociatePricing.destroy({ where: { id } });
  }

  async findBy(by) {
    return await AssociatePricing.findOne({ where: by });
  }
}

module.exports = new AssociatePricingServices();
