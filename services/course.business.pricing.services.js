const { CourseBusinessPricing } = require("../models");

class FundingBusinessPricingServices {
  async all() {
    return await CourseBusinessPricing.findAll();
  }
  async findOne(id) {
    return await CourseBusinessPricing.findOne({ where: { id } });
  }
  async findBy(by) {
    return await CourseBusinessPricing.findOne({ where: by });
  }

  async findAllBy(by) {
    return await CourseBusinessPricing.findOne({ where: by });
  }

  async store(req) {
    return await CourseBusinessPricing.create(req.body);
  }

  async update(id, req) {
    return await CourseBusinessPricing.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await CourseBusinessPricing.destroy({ where: { id } });
  }

  async findBy(by) {
    return await CourseBusinessPricing.findOne({ where: by });
  }
}

module.exports = new FundingBusinessPricingServices();
