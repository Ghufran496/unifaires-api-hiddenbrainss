const { CoursePaymentType } = require("../models");

class JobPaymentTypeServices {
  async all() {
    return await CoursePaymentType.findAll();
  }

  async findOne(id) {
    return await CoursePaymentType.findOne({ where: { id } });
  }

  async findBy(by) {
    return await CoursePaymentType.findOne({ where: by });
  }

  async findAllBy(by) {
    return await CoursePaymentType.findAll({ where: by });
  }

  async store(req) {
    return await CoursePaymentType.create(req.body);
  }

  async update(id, req) {
    return await CoursePaymentType.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await CoursePaymentType.destroy({ where: { id } });
  }
}

module.exports = new JobPaymentTypeServices();
