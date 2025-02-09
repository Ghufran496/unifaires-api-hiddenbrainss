const { JobsPaymentType } = require("../models");

class JobPaymentTypeServices {
  async all() {
    return await JobsPaymentType.findAll();
  }
  async findOne(id) {
    return await JobsPaymentType.findOne({ where: { id } });
  }
  async store(req) {
    return await JobsPaymentType.create(req.body);
  }
  async update(id, req) {
    return await JobsPaymentType.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await JobsPaymentType.destroy({ where: { id } });
  }
}

module.exports = new JobPaymentTypeServices();
