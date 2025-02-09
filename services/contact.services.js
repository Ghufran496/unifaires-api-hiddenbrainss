const { Contact, User, Business } = require("../models");

class ContactServices {
  async all() {
    return await Contact.findAll({
      include: [
        {
          model: User,
          as: "contactUser",
        },

        {
          model: Business,
          as: "contactBusiness",
        },
      ],
    });
  }
  async findOne(id) {
    return await Contact.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "contactUser",
        },

        {
          model: Business,
          as: "contactBusiness",
        },
      ],
    });
  }
  async findBy(by) {
    return await Contact.findOne({
      where: by,
      include: [
        {
          model: User,
          as: "contactUser",
        },

        {
          model: Business,
          as: "contactBusiness",
        },
      ],
    });
  }
  async findAllBy(by) {
    return await Contact.findAll({
      where: by,
      include: [
        {
          model: User,
          as: "contactUser",
        },

        {
          model: Business,
          as: "contactBusiness",
        },
      ],
    });
  }
  async store(req) {
    return await Contact.create(req.body);
  }
  async update(id, req) {
    return await Contact.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await Contact.destroy({ where: { id } });
  }
}

module.exports = new ContactServices();
