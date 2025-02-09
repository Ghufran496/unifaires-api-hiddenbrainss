const { FundingPaymentType } = require("../models");

class JobPaymentTypeServices {
  async all() {
    return await FundingPaymentType.findAll();
  }

  async findOne(id) {
    return await FundingPaymentType.findOne({ where: { id } });
  }

  async findBy(by) {
    return await FundingPaymentType.findOne({ where: by });
  }

  async findAllBy(by) {
    return await FundingPaymentType.findAll({ where: by });
  }

  async store(req) {
    return await FundingPaymentType.create(req.body);
  }

  async update(id, req) {
    return await FundingPaymentType.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await FundingPaymentType.destroy({ where: { id } });
  }
}

module.exports = new JobPaymentTypeServices();
