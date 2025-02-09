const { Lecture } = require("../../models");

class LectureServices {
  async all() {
    return await Lecture.findAll();
  }
  async findOne(id) {
    return await Lecture.findOne({ where: { id } });
  }

  async store(req) {
    return await Lecture.create(req.body);
  }
  async update(id, req) {
    return await Lecture.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await Lecture.destroy({ where: { id } });
  }
  async findByTitle(title, sectionId) {
    return await Lecture.findOne({ where: { title, sectionId } });
  }
  async findBy(by) {
    return await Lecture.findOne({ where: by });
  }
  async findAllBy(by) {
    return await Lecture.findAll({ where: by });
  }

  // content services

  //  resources services
}

module.exports = new LectureServices();
