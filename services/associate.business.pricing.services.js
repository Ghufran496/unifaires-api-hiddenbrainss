const { AssociateBusinessPricing } = require("../models");

class AssociateBusinessPricingServices {
  async all() {
    return await AssociateBusinessPricing.findAll();
  }
  async findOne(id) {
    return await AssociateBusinessPricing.findOne({ where: { id } });
  }
  async findBy(by) {
    return await AssociateBusinessPricing.findOne({ where: by });
  }

  async findAllBy(by) {
    return await AssociateBusinessPricing.findOne({ where: by });
  }

  async store(req) {
    return await AssociateBusinessPricing.create(req.body);
  }

  async update(id, req) {
    return await AssociateBusinessPricing.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await AssociateBusinessPricing.destroy({ where: { id } });
  }

  async findBy(by) {
    return await AssociateBusinessPricing.findOne({ where: by });
  }
}

module.exports = new AssociateBusinessPricingServices();
