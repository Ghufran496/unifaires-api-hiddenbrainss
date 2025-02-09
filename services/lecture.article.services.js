const { LectureArticle } = require("../models");

class LectureArticleServices {
  async all() {
    return await LectureArticle.findAll();
  }

  async findOne(id) {
    return await LectureArticle.findOne({ where: { id } });
  }

  async findBy(by) {
    return await LectureArticle.findOne({ where: by });
  }

  async findAllBy(by) {
    return await LectureArticle.findAll({ where: by });
  }

  async store(req) {
    return await LectureArticle.create(req.body);
  }
  async update(id, req) {
    return await LectureArticle.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await LectureArticle.destroy({ where: { id } });
  }
}

module.exports = new LectureArticleServices();
