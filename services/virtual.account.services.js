const { VirtualAccount } = require("../models");

class VirtualAccountServices {
  async all() {
    return await VirtualAccount.findAll();
  }
  async findOne(id) {
    return await VirtualAccount.findOne({ where: { id } });
  }
  async findBy(by) {
    return await VirtualAccount.findOne({ where: by });
  }
  async findAllBy(by) {
    return await VirtualAccount.findAll({ where: by });
  }

  async store(req) {
    return await VirtualAccount.create(req.body);
  }
  async update(id, req) {
    return await VirtualAccount.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await VirtualAccount.destroy({ where: { id } });
  }
}

module.exports = new VirtualAccountServices();
