const { AdminSocials, User, Business } = require("../models");

class SocialServices {
  async all() {
    return await AdminSocials.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
  }

  async findOne(id) {
    return await AdminSocials.findOne({
      where: { id },
      include: [
        {
          model: User,
        },
      ],
    });
  }

  async findBy(by) {
    return await AdminSocials.findOne({
      where: by,
      include: [
        {
          model: User,
        },
      ],
    });
  }

  async findAllBy(by) {
    return await AdminSocials.findAll({
      where: by,
      include: [
        {
          model: User,
        },
      ],
    });
  }

  async store(req) {
    return await AdminSocials.create(req.body);
  }

  async bulkStore(data) {
    return await AdminSocials.bulkCreate(data);
  }

  async update(id, req) {
    return await AdminSocials.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await AdminSocials.destroy({ where: { id } });
  }
}

module.exports = new SocialServices();
