const {
  Section,
  Lecture,
  LectureContent,
  LectureResource,
  Quiz,
  QuizQuestion,
} = require("../../models");

class SectionServices {
  async getAllSection() {
    return await Section.findAll();
  }
  async getAllSectionById(id) {
    return await Section.findOne({ where: { id } });
  }

  async findOne(id) {
    return await Section.findOne({ where: { id } });
  }

  async findBy(by) {
    return await Section.findOne({ where: by });
  }

  async findAllBy(by) {
    return await Section.findAll({ where: by });
  }

  async storeSection(req) {
    return await Section.create(req.body);
  }
  async updateSection(id, req) {
    return await Section.update(req.body, { where: { id } });
  }
  async deleteSection(id) {
    return await Section.destroy({ where: { id } });
  }

  async getAllCourseSection(courseId) {
    return await Section.findAll({
      where: { courseId },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: Lecture,
          separate: true,
          order: [["createdAt", "ASC"]],
          include: [
            {
              model: LectureContent,
              separate: true,
              order: [["createdAt", "ASC"]],
            },
            {
              model: LectureResource,
              separate: true,
              order: [["createdAt", "ASC"]],
            },
          ],
        },
        {
          model: Quiz,
          separate: true,
          order: [["createdAt", "ASC"]],

          include: [
            {
              model: QuizQuestion,
              separate: true,
              order: [["createdAt", "ASC"]],
            },
          ],
        },
      ],
    });
  }
}

module.exports = new SectionServices();
