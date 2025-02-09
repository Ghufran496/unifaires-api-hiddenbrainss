const { Assignment } = require("../../models");
class AssignmentServices {
  async all() {
    return await Assignment.findAll();
  }

  async findOne(id) {
    return await Assignment.findOne({ where: { id } });
  }
  async findAllBy(by) {
    return await Assignment.findAll({ where: by });
  }
  async store(req) {
    return await Assignment.create(req.body);
  }
  async update(id, req) {
    return await Assignment.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await Assignment.destroy({ where: { id } });
  }
}

module.exports = new AssignmentServices();
