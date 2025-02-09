const { GeneralCoursePayout } = require("../models");

class GeneralCoursePayoutServices {
  async all() {
    return await GeneralCoursePayout.findAll();
  }

  async findOne(id) {
    return await GeneralCoursePayout.findOne({ where: { id } });
  }

  async findBy(by) {
    return await GeneralCoursePayout.findOne({ where: by });
  }

  async findAllBy(by) {
    return await GeneralCoursePayout.findAll({ where: by });
  }

  async store(req) {
    return await GeneralCoursePayout.create(req.body);
  }

  async update(id, req) {
    return await GeneralCoursePayout.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await GeneralCoursePayout.destroy({ where: { id } });
  }
}

module.exports = new GeneralCoursePayoutServices();
