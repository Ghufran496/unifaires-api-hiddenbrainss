const { JobBusinessPricings } = require("../models");

class JobBusinessPricingsServices {
  async all() {
    return await JobBusinessPricings.findAll();
  }
  async findOne(id) {
    return await JobBusinessPricings.findOne({ where: { id } });
  }
  async findBy(by) {
    return await JobBusinessPricings.findOne({ where: by });
  }

  async findAllBy(by) {
    return await JobBusinessPricings.findOne({ where: by });
  }

  async store(req) {
    return await JobBusinessPricings.create(req.body);
  }

  async update(id, req) {
    return await JobBusinessPricings.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await JobBusinessPricings.destroy({ where: { id } });
  }

  async findBy(by) {
    return await JobBusinessPricings.findOne({ where: by });
  }
}

module.exports = new JobBusinessPricingsServices();
