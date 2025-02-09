const { InviteCountryPricing } = require("../models");

class InviteCountryPricingsServices {
  async all() {
    return await InviteCountryPricing.findAll();
  }
  async findOne(id) {
    return await InviteCountryPricing.findOne({ where: { id } });
  }
  async findBy(by) {
    return await InviteCountryPricing.findOne({ where: by });
  }

  async findAllBy(by) {
    return await InviteCountryPricing.findOne({ where: by });
  }

  async store(req) {
    return await InviteCountryPricing.create(req.body);
  }

  async update(id, req) {
    return await InviteCountryPricing.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await InviteCountryPricing.destroy({ where: { id } });
  }

  async findBy(by) {
    return await InviteCountryPricing.findOne({ where: by });
  }
}

module.exports = new InviteCountryPricingsServices();
