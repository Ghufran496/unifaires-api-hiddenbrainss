const { Pricing } = require("../../models");

class PricingServices {
  async all() {
    return await Pricing.findAll();
  }

  async findOne(id) {
    return await Pricing.findOne({ where: { id } });
  }

  async findBy(by) {
    return await Pricing.findOne({ where: by });
  }

  async store(req) {
    return await Pricing.create(req.body);
  }

  async update(id, req) {
    return await Pricing.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Pricing.destroy({ where: { id } });
  }

  async getCoursePricingById(courseId) {
    return await Pricing.findOne({ where: { courseId } });
  }
}

module.exports = new PricingServices();
