const { LectureQuiz } = require("../../models");

class LectureQuizServices {
  async all() {
    return await LectureQuiz.findAll();
  }
  async findOne(id) {
    return await LectureQuiz.findOne({ where: { id } });
  }

  async findBy(by) {
    return await LectureQuiz.findOne({ where: { by } });
  }

  async findAllBy(by) {
    return await LectureQuiz.findAll({ where: { by } });
  }

  async store(req) {
    return await LectureQuiz.create(req.body);
  }
  async update(id, req) {
    return await LectureQuiz.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await LectureQuiz.destroy({ where: { id } });
  }
}

module.exports = new LectureQuizServices();
