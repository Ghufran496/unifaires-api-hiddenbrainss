const { CoursesAnnouncement } = require("../models");

class CoursesAnnouncementServices {
  async all() {
    return await CoursesAnnouncement.findAll();
  }
  async findOne(id) {
    return await CoursesAnnouncement.findOne({ where: { id } });
  }
  async findBy(by) {
    return await CoursesAnnouncement.findOne({ where: by });
  }
  async findAllBy(by) {
    return await CoursesAnnouncement.findAll({ where: by });
  }
  async store(req) {
    return await CoursesAnnouncement.create(req.body);
  }
  async update(id, req) {
    return await CoursesAnnouncement.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await CoursesAnnouncement.destroy({ where: { id } });
  }
}

module.exports = new CoursesAnnouncementServices();
