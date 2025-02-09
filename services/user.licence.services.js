const { UserLicense } = require("../models");

class UserLicenseServices {
  async all() {
    return await UserLicense.findAll();
  }

  async findOne(id) {
    return await UserLicense.findOne({ where: { id } });
  }

  async findBy(by) {
    return await UserLicense.findOne({ where: by });
  }

  async findAllBy(by) {
    return await UserLicense.findAll({ where: by });
  }

  async store(req) {
    return await UserLicense.create(req.body);
  }

  async update(id, req) {
    return await UserLicense.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await UserLicense.destroy({ where: { id } });
  }
}

module.exports = new UserLicenseServices();
