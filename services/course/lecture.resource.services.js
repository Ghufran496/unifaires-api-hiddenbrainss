const { LectureResource } = require("../../models");

class LectureResourceServices {
  async all() {
    return await LectureResource.findAll();
  }
  async findOne(id) {
    return await LectureResource.findOne({ where: { id } });
  }

  async findBy(by) {
    return await LectureResource.findOne({ where: by });
  }

  async store(req) {
    return await LectureResource.create(req.body);
  }
  async update(id, req) {
    return await LectureResource.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await LectureResource.destroy({ where: { id } });
  }
}

module.exports = new LectureResourceServices();
