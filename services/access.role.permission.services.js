const {
  AccessRolePermission,
  AccessRole,
  AccessPermission,
} = require("../models");

class AccessRolePermissionServices {
  async all() {
    return await AccessRole.findAll({
      include: [
        {
          model: AccessRolePermission,
          include: [
            {
              model: AccessPermission,
            },
          ],
        },
      ],
    });
  }
  async findOne(id) {
    return await AccessRolePermission.findOne({ where: { id } });
  }
  async findBy(by) {
    return await AccessRolePermission.findOne({ where: by });
  }

  async findAllBy(by) {
    return await AccessRole.findAll({
      where: by,
      include: [
        {
          model: AccessRolePermission,
          include: [
            {
              model: AccessPermission,
            },
          ],
        },
      ],
    });
  }
  async findAllByRole(by) {
    return await AccessRole.findOne({
      where: by,
      include: [
        {
          model: AccessRolePermission,
          include: [
            {
              model: AccessPermission,
            },
          ],
        },
      ],
    });
  }

  async store(req) {
    return await AccessRolePermission.create(req.body);
  }
  async update(id, req) {
    return await AccessRolePermission.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await AccessRolePermission.destroy({ where: { id } });
  }
}

module.exports = new AccessRolePermissionServices();
