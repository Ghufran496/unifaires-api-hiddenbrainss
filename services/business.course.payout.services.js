const { BusinessCoursePayout } = require("../models");

class BusinessCoursePayoutServices {
  async all() {
    return await BusinessCoursePayout.findAll();
  }

  async findOne(id) {
    return await BusinessCoursePayout.findOne({ where: { id } });
  }

  async findBy(by) {
    return await BusinessCoursePayout.findOne({ where: by });
  }

  async findAllBy(by) {
    return await BusinessCoursePayout.findAll({ where: by });
  }

  async store(req) {
    return await BusinessCoursePayout.create(req.body);
  }

  async update(id, req) {
    return await BusinessCoursePayout.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await BusinessCoursePayout.destroy({ where: { id } });
  }
}

module.exports = new BusinessCoursePayoutServices();
