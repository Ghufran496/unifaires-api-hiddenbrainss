const { LectureContent } = require("../../models");

class LectureContentServices {
  async all() {
    return await LectureContent.findAll();
  }
  async findOne(id) {
    return await LectureContent.findOne({ where: { id } });
  }
  async findBy(by) {
    return await LectureContent.findOne({ where: by });
  }
  async store(req) {
    return await LectureContent.create(req.body);
  }
  async update(id, req) {
    return await LectureContent.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await LectureContent.destroy({ where: { id } });
  }
}

module.exports = new LectureContentServices();
