const { AccessPermission } = require("../models");

class AccessPermissionServices {
  async all(options = {}) {
    return await AccessPermission.findAll({
      order: [['title', 'ASC']], // Order by the 'title' field in ascending order
      ...options,
    });
  }
  async findOne(id, options = {}) {
    return await AccessPermission.findOne({ where: { id }, ...options });
  }
  async store(req, options = {}) {
    const data = req.body;

    return await AccessPermission.create({ ...data, ...options });
  }
  async update(id, req, options = {}) {
    return await AccessPermission.update(req.body, {
      where: { id },
      ...options,
    });
  }
  async destroy(id, options = {}) {
    return await AccessPermission.destroy({ where: { id }, ...options });
  }

  async findBy(by, options = {}) {
    return await AccessPermission.findOne({
      where: by,
      ...options,
    });
  }
  async findAllBy(by, options = {}) {
    return await AccessPermission.findAll({
      where: by,
      ...options,
    });
  }
}

module.exports = new AccessPermissionServices();
