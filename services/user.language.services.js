const { UserLanguage } = require("../models");

class UserLanguageServices {
  async all() {
    return await UserLanguage.findAll();
  }

  async findOne(id) {
    return await UserLanguage.findOne({ where: { id } });
  }

  async findBy(by) {
    return await UserLanguage.findOne({ where: by });
  }

  async findAllBy(by) {
    return await UserLanguage.findOne({ where: by });
  }

  async store(req) {
    return await UserLanguage.bulkCreate(req.body);
  }

  async update(id, req) {
    return await UserLanguage.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await UserLanguage.destroy({ where: { id } });
  }
}

module.exports = new UserLanguageServices();
