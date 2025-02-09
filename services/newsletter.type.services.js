const { NewsLetterType } = require("../models");

class NewsLetterTypeServices {
  async all() {
    return await NewsLetterType.findAll();
  }

  async findOne(id) {
    return await NewsLetterType.findOne({ where: { id } });
  }

  async findBy(by) {
    return await NewsLetterType.findOne({ where: by });
  }

  async findAllBy(by) {
    return await NewsLetterType.findOne({ where: by });
  }

  async store(req) {
    return await NewsLetterType.create(req.body);
  }

  async update(id, req) {
    return await NewsLetterType.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await NewsLetterType.destroy({ where: { id } });
  }
}

module.exports = new NewsLetterTypeServices();
