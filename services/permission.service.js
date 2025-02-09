const { Permission } = require("../models");

class PermissionServices {
  async getAllPermission() {
    return await Permission.findAll();
  }
  async getAllPermissionById(id) {
    return await Permission.findOne({ where: { id } });
  }
  async storePermission(req) {
    return await Permission.create(req.body);
  }
  async updatePermission(id, req) {
    return await Permission.update(req.body, { where: { id } });
  }
  async deletePermission(id) {
    return await Permission.destroy({ where: { id } });
  }

  async getAllPermissionByTitle(title) {
    return await Permission.findOne({
      where: { title },
    });
  }
}

module.exports = new PermissionServices();
