const { CourseProgress } = require("../models");

class CourseProgressServices {
  async all() {
    return await CourseProgress.findAll();
  }
  async findOne(id) {
    return await CourseProgress.findOne({ where: { id } });
  }
  async findBy(by) {
    return await CourseProgress.findOne({ where: by });
  }

  async findBy(by) {
    return await CourseProgress.findOne({ where: by });
  }
  async findAllBy(by) {
    return await CourseProgress.findAll({ where: by });
  }
  async store(req) {
    return await CourseProgress.create(req.body);
  }
  async update(id, req) {
    return await CourseProgress.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await CourseProgress.destroy({ where: { id } });
  }
}

module.exports = new CourseProgressServices();
