const { Education, User } = require("../models");

class EducationServices {
  async all() {
    return await Education.findAll({
      include: [{ model: User }],
    });
  }
  async findOne(id) {
    return await Education.findOne({
      where: { id },
      include: [{ model: User }],
    });
  }

  async findBy(by) {
    return await Education.findOne({
      where: by,

      include: [{ model: User }],
    });
  }

  async findAllBy(by) {
    return await Education.findAll({
      where: by,

      include: [{ model: User }],
    });
  }

  async store(req) {
    return await Education.bulkCreate(req.body);
  }
  async update(id, req) {
    return await Education.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await Education.destroy({ where: { id } });
  }
}

module.exports = new EducationServices();
