const { ChatMessages, Chats } = require("../models");

class ChatMessagesServices {
  async all() {
    return await ChatMessages.findAll();
  }

  async findOne(id) {
    return await ChatMessages.findOne({
      where: { id },
      include: [
        {
          model: Chats,
        },
      ],
    });
  }

  async findBy(by) {
    return await ChatMessages.findOne({ where: by });
  }

  async findAllBy(by) {
    return await ChatMessages.findOne({ where: by });
  }

  async store(req) {
    return await ChatMessages.create(req.body);
  }

  async update(id, req) {
    return await ChatMessages.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await ChatMessages.destroy({ where: { id } });
  }

  async getChatMessages(req, offset, limit) {
    const { id: chatId } = req.params;

    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (!!ChatMessages.getAttributes()[key]) {
          filterValue[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    return await ChatMessages.findAndCountAll({
      where: { chatId },
      offset,
      limit,
    });
  }
}

module.exports = new ChatMessagesServices();
