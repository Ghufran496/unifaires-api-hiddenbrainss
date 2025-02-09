const { JobsSkills } = require("../models");

class JobsSkillsServices {
  async all() {
    return await JobsSkills.findAll();
  }
  async findOne(id) {
    return await JobsSkills.findOne({ where: { id } });
  }

  async store(req) {
    return await JobsSkills.create(req.body);
  }

  async bulkStore(data) {
    return await JobsSkills.bulkCreate(data);
  }

  async update(id, req) {
    return await JobsSkills.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await JobsSkills.destroy({ where: { id } });
  }

  async bulkStore(data, transaction) {
    return await JobsSkills.bulkCreate(data, { transaction });
  }

  async destroyBy(by) {
    return await JobsSkills.destroy({ where: by });
  }
}

module.exports = new JobsSkillsServices();
