const { CourseCertificate } = require("../models");

class CourseCertificateServices {
  async all() {
    return await CourseCertificate.findAll();
  }

  async findOne(id) {
    return await CourseCertificate.findOne({ where: { id } });
  }

  async findBy(by) {
    return await CourseCertificate.findOne({ where: by });
  }

  async findAllBy(by) {
    return await CourseCertificate.findAll({ where: by });
  }

  async store(req) {
    return await CourseCertificate.create(req.body);
  }

  async update(id, req) {
    return await CourseCertificate.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await CourseCertificate.destroy({ where: { id } });
  }
}

module.exports = new CourseCertificateServices();
