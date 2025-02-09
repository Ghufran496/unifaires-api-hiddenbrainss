const { InviteBusinessPricing } = require("../models");

class InviteBusinessPricingServices {
  async all() {
    return await InviteBusinessPricing.findAll();
  }
  async findOne(id) {
    return await InviteBusinessPricing.findOne({ where: { id } });
  }
  async findBy(by) {
    return await InviteBusinessPricing.findOne({ where: by });
  }

  async findAllBy(by) {
    return await InviteBusinessPricing.findOne({ where: by });
  }

  async store(req) {
    return await InviteBusinessPricing.create(req.body);
  }

  async update(id, req) {
    return await InviteBusinessPricing.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await InviteBusinessPricing.destroy({ where: { id } });
  }

  async findBy(by) {
    return await InviteBusinessPricing.findOne({ where: by });
  }
}

module.exports = new InviteBusinessPricingServices();
