const { AssociatePaymentType } = require("../models");

class AssociatePaymentServices {
  async all() {
    return await AssociatePaymentType.findAll();
  }

  async findOne(id) {
    return await AssociatePaymentType.findOne({ where: { id } });
  }

  async findBy(by) {
    return await AssociatePaymentType.findOne({ where: by });
  }

  async findAllBy(by) {
    return await AssociatePaymentType.findAll({ where: by });
  }

  async store(req) {
    return await AssociatePaymentType.create(req.body);
  }

  async update(id, req) {
    return await AssociatePaymentType.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await AssociatePaymentType.destroy({ where: { id } });
  }
}

module.exports = new AssociatePaymentServices();
