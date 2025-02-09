const { UsersIndustries, Industry } = require("../models");

class UsersSkillsServices {
  async all() {
    return await UsersIndustries.findAll({
      include: [
        {
          model: Industry,
        },
      ],
    });
  }

  async findOne(id) {
    return await UsersIndustries.findOne({
      where: { id },
      include: [
        {
          model: Industry,
        },
      ],
    });
  }

  async findBy(by) {
    return await UsersIndustries.findOne({
      where: by,
      include: [
        {
          model: Industry,
        },
      ],
    });
  }

  async findAllBy(by) {
    return await UsersIndustries.findAll({
      where: by,
      include: [
        {
          model: Industry,
        },
      ],
    });
  }

  async store(req) {
    return await UsersIndustries.create(req.body);
  }

  async update(id, req) {
    return await UsersIndustries.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await UsersIndustries.destroy({ where: { id } });
  }
}

module.exports = new UsersSkillsServices();
