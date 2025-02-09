const { HelpChats, Help, User, Business } = require("../models");

class HelpChatsServices {
  async all() {
    return await HelpChats.findAll({
      include: [
        {
          model: Help,
        },
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
          as: "agent",
        },
      ],
    });
  }

  async getHelpChats(req, offset, limit) {
    const { helpId } = req.params;

    return await HelpChats.findAndCountAll({
      distinct: true,
      where: { helpId },
      include: [
        {
          model: Help,
        },
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
          as: "agent",
        },
      ],
      offset,
      limit,
    });
  }

  async findOne(id) {
    return await HelpChats.findOne({
      where: { id },
      include: [
        {
          model: Help,
        },
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
          as: "agent",
        },
      ],
    });
  }

  async findBy(by) {
    return await HelpChats.findOne({
      where: by,
      include: [
        {
          model: Help,
        },
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
          as: "agent",
        },
      ],
    });
  }

  async findAllBy(by) {
    return await HelpChats.findOne({
      where: by,
      include: [
        {
          model: Help,
        },
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
          as: "agent",
        },
      ],
    });
  }

  async store(req) {
    return await HelpChats.create(req.body);
  }

  async update(id, req) {
    return await HelpChats.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await HelpChats.destroy({ where: { id } });
  }

  // get ticket chats
  async getTicketsChats(req, helpId, offset, limit) {
    return await HelpChats.findAndCountAll({
      distinct: true,
      where: { helpId },
      include: [
        {
          model: Help,
        },
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
          as: "agent",
        },
      ],
      offset,
      limit,
      order: [["createdAt", "ASC"]],
    });
  }
}

module.exports = new HelpChatsServices();
