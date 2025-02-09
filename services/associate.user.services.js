const { AssociateUser, User, Business } = require("../models");

class AssociateUserServices {
  async all() {
    return await AssociateUser.findAll({});
  }
  async findOne(id) {
    return await AssociateUser.findOne({ where: { id } });
  }
  async store(req) {
    return await AssociateUser.create(req.body);
  }
  async update(id, req) {
    return await AssociateUser.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await AssociateUser.destroy({ where: { id } });
  }

  async validateToken(req) {
    // che
  }

  async findBy(by) {
    return await AssociateUser.findAll({
      where: by,
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
  }
  async findOneBy(by) {
    return await AssociateUser.findOne({
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
    return await AssociateUser.findAll({
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
        {
          model: User,
          as: "invitedUser",
        },
      ],
    });
  }
}

module.exports = new AssociateUserServices();
