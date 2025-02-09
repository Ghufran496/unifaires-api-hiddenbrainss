const { AssociateCountryPricing } = require("../models");

class AssociateCountryPricingsServices {
  async all() {
    return await AssociateCountryPricing.findAll();
  }
  async findOne(id) {
    return await AssociateCountryPricing.findOne({ where: { id } });
  }
  async findBy(by) {
    return await AssociateCountryPricing.findOne({ where: by });
  }

  async findAllBy(by) {
    return await AssociateCountryPricing.findOne({ where: by });
  }

  async store(req) {
    return await AssociateCountryPricing.create(req.body);
  }

  async update(id, req) {
    return await AssociateCountryPricing.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await AssociateCountryPricing.destroy({ where: { id } });
  }

  async findBy(by) {
    return await AssociateCountryPricing.findOne({ where: by });
  }
}

module.exports = new AssociateCountryPricingsServices();
