const { Social, User, Business } = require("../models");

class SocialServices {
  async all() {
    return await Social.findAll({
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Business,
          as: "business",
        },
      ],
    });
  }

  async findOne(id) {
    return await Social.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Business,
          as: "business",
        },
      ],
    });
  }

  async findBy(by) {
    return await Social.findOne({
      where: by,
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Business,
          as: "business",
        },
      ],
    });
  }

  async findAllBy(by) {
    return await Social.findAll({
      where: by,
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Business,
          as: "business",
        },
      ],
    });
  }

  async store(req) {
    return await Social.create(req.body);
  }

  async bulkStore(data) {
    return await Social.bulkCreate(data);
  }

  async update(id, req) {
    return await Social.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Social.destroy({ where: { id } });
  }
}

module.exports = new SocialServices();
