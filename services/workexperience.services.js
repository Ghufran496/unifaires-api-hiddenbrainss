const { WorkExperience, User } = require("../models");

class WorkExperienceServices {
  async all() {
    return await WorkExperience.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
  }
  async findOne(id) {
    return await WorkExperience.findOne({
      where: { id },
      include: [
        {
          model: User,
        },
      ],
    });
  }
  async findBy(by) {
    return await WorkExperience.findOne({
      where: by,
      include: [
        {
          model: User,
        },
      ],
    });
  }
  async findAllBy(by) {
    return await WorkExperience.findAll({
      where: by,
      include: [
        {
          model: User,
        },
      ],
    });
  }
  async store(req) {
    return await WorkExperience.bulkCreate(req.body);
  }
  async update(id, req) {
    return await WorkExperience.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await WorkExperience.destroy({ where: { id } });
  }
}

module.exports = new WorkExperienceServices();
