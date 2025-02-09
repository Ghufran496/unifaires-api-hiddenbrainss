const { DrivingLicense } = require("../models");

class DrivingLicenseServices {
  async all() {
    return await DrivingLicense.findAll();
  }
  async findOne(id) {
    return await DrivingLicense.findOne({ where: { id } });
  }
  async findBy(by) {
    return await DrivingLicense.findOne({ where: by });
  }
  async findAllBy(by) {
    return await DrivingLicense.findAll({ where: by });
  }
  async store(req) {
    return await DrivingLicense.bulkCreate(req.body);
  }
  async update(id, req) {
    return await DrivingLicense.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await DrivingLicense.destroy({ where: { id } });
  }
}

module.exports = new DrivingLicenseServices();
