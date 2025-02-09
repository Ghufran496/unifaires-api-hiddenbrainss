const { InvitePaymentType } = require("../models");

class InvitePaymentTypeServices {
  async all() {
    return await InvitePaymentType.findAll();
  }

  async findOne(id) {
    return await InvitePaymentType.findOne({ where: { id } });
  }

  async findBy(by) {
    return await InvitePaymentType.findOne({ where: by });
  }

  async findAllBy(by) {
    return await InvitePaymentType.findAll({ where: by });
  }

  async store(req) {
    return await InvitePaymentType.create(req.body);
  }

  async update(id, req) {
    return await InvitePaymentType.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await InvitePaymentType.destroy({ where: { id } });
  }
}

module.exports = new InvitePaymentTypeServices();
