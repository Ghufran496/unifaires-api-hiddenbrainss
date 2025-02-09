const { CourseSkills } = require("../models");
class CourseSkillsServices {
  async all() {
    return await CourseSkills.findAll();
  }

  async findOne(id) {
    return await CourseSkills.findOne({ where: { id } });
  }

  async store(req) {
    return await CourseSkills.create(req.body);
  }

  async bulkStore(data, transaction) {
    return await CourseSkills.bulkCreate(data, { transaction });
  }

  async update(id, req) {
    return await CourseSkills.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await CourseSkills.destroy({ where: { id } });
  }
  async destroyBy(by) {
    return await CourseSkills.destroy({ where: by });
  }
}

module.exports = new CourseSkillsServices();
