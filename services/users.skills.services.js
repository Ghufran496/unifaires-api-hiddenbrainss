const { UsersSkills, Skills, User } = require("../models");

class UsersSkillsServices {
  async all() {
    return await UsersSkills.findAll({
      include: [
        {
          model: Skills,
        },
      ],
    });
  }

  async findOne(id) {
    return await UsersSkills.findOne({
      where: { id },
      include: [
        {
          model: Skills,
        },
      ],
    });
  }

  async findBy(by) {
    return await UsersSkills.findOne({
      where: by,
      include: [
        {
          model: Skills,
        },
      ],
    });
  }

  async findAllBy(by) {
    return await UsersSkills.findAll({
      where: by,
      include: [
        {
          model: Skills,
        },
      ],
    });
  }

  async store(req) {
    return await UsersSkills.create(req.body);
  }

  async update(id, req) {
    return await UsersSkills.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await UsersSkills.destroy({ where: { id } });
  }
}

module.exports = new UsersSkillsServices();
