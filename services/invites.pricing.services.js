const { InvitePricings } = require("../models");

class InvitePricingsServices {
  async all() {
    return await InvitePricings.findAll({});
  }
  async findOne(id) {
    return await InvitePricings.findOne({ where: { id } });
  }
  async store(req) {
    return await InvitePricings.create(req.body);
  }
  async update(id, req) {
    return await InvitePricings.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await InvitePricings.destroy({ where: { id } });
  }

  async validateToken(req) {
    // che
  }

  async findBy(by) {
    return await InvitePricings.findOne({
      where: by,
    });
  }
  async findOneBy(by) {
    return await InvitePricings.findOne({
      where: by,
    });
  }
}

module.exports = new InvitePricingsServices();
