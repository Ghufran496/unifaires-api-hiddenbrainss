const { AccessRole, User, AccessPermission } = require("../models");

class AccessRoleServices {
  async all(options = {}) {
    return await AccessRole.findAll({ ...options });
  }
  async findOne(id, options = {}) {
    return await AccessRole.findOne({
      where: { id },
      attributes: ["id", "title"],
      ...options,
    });
  }
  async store(req, options = {}) {
    const data = req.body;
    return await AccessRole.create({ ...data, ...options });
  }
  async update(id, req, options = {}) {
    return await AccessRole.update(req.body, { where: { id }, ...options });
  }
  async destroy(id, options = {}) {
    return await AccessRole.destroy({ where: { id }, ...options });
  }

  async findAllBy(by, options = {}) {
    return await AccessRole.findAll({ where: by, ...options });
  }

  async findBy(by, options = {}) {
    return await AccessRole.findOne({ where: by, ...options });
  }
}

module.exports = new AccessRoleServices();
