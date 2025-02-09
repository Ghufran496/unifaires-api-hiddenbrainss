const { Role, User } = require("../models");

class RoleServices {
  async all() {
    return await Role.findAll();
  }
  async findOne(id) {
    return await Role.findOne({
      where: { id },
      attributes: ["id", "title"],
    });
  }
  async store(req) {
    return await Role.create(req.body);
  }
  async update(id, req) {
    return await Role.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await Role.destroy({ where: { id } });
  }

  async findByAll(by) {
    return await Role.findAll({ where: by });
  }

  async findBy(by) {
    return await Role.findOne({ where: by });
  }

  async changeUserRole(req) {
    const { roleId, userId } = req.body;
    return await User.update({ roleId }, { where: { id: userId } });
  }
}

module.exports = new RoleServices();
