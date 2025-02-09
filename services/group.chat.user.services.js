const { GroupChatUsers } = require("../models");

class GroupChatUsersServices {
  async all() {
    return await GroupChatUsers.findAll();
  }
  async findOne(id) {
    return await GroupChatUsers.findOne({ where: { id } });
  }

  async findBy(by) {
    return await GroupChatUsers.findOne({ where: by });
  }

  async store(req) {
    return await GroupChatUsers.create(req.body);
  }
  async update(id, req) {
    return await GroupChatUsers.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await GroupChatUsers.destroy({ where: { id } });
  }

  async getChatUsers(req) {
    const { chatId } = req.params;

    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (!!GroupChatUsers.getAttributes()[key]) {
          filterValue[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    return await GroupChatUsers.findAndCountAll({
      distinct: true,
      where: { chatId, ...filterValue },
    });
  }
}

module.exports = new GroupChatUsersServices();
