const { Instructor } = require("../../models");

class InstructorServices {
  async getAllInstructor() {
    return await Instructor.findAll();
  }

  async getAllInstructorById(id) {
    return await Instructor.findOne({ where: { id } });
  }
  async findOne(id) {
    return await Instructor.findOne({ where: { id } });
  }
  async findAllBy(id) {
    return await Instructor.findOne({ where: { id } });
  }

  async storeInstructor(req) {
    return await Instructor.create(req.body);
  }
  async store(req) {
    return await Instructor.create(req.body);
  }
  async updateInstructor(id, req) {
    return await Instructor.update(req.body, { where: { id } });
  }
  async deleteInstructor(id) {
    return await Instructor.destroy({ where: { id } });
  }
  async update(id, req) {
    return await Instructor.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await Instructor.destroy({ where: { id } });
  }

  async getCourseInstructor(courseId) {
    return await Instructor.findAll({ where: { courseId } });
  }
}

module.exports = new InstructorServices();
