const { Address } = require("../models");

class AddressServices {
  async all() {
    return await Address.findAll();
  }

  async getAddressDefaultByUserId(by) {
    return await Address.findOne({
      $and: [by, { default: 1 }],
    });
  }

  async findAllBy(by) {
    return await Address.findAll({
      where: by,
    });
  }

  async findOne(id) {
    return await Address.findOne({
      where: { id },
    });
  }
  async findBy(by) {
    return await Address.findOne({
      where: by,
    });
  }

  async store(req) {
    return await Address.create(req.body);
  }

  async update(id, req) {
    return await Address.update(req.body, {
      where: { id },
    });
  }
  async removeUserDefault(condition) {
    return await Address.update(
      { default: false, ...condition },
      {
        where: condition,
      }
    );
  }

  async destroy(id) {
    return await Address.destroy({
      where: { id: id },
    });
  }
}

module.exports = new AddressServices();
