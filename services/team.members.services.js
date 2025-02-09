const { TeamMembers } = require("../models");

class TeamMembersServices {
  async all() {
    return await TeamMembers.findAll();
  }
  async findOne(id) {
    return await TeamMembers.findOne({ where: { id } });
  }
  async store(req) {
    return await TeamMembers.create(req.body);
  }
  async update(id, req) {
    return await TeamMembers.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await TeamMembers.destroy({ where: { id } });
  }
}

module.exports = new TeamMembersServices();
