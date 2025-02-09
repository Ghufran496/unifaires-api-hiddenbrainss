const { HelpTrack, User, Help } = require("../models");
const sequelize = require("../database/index");

class HelpTrackServices {
  async all() {
    return await HelpTrack.findAll({
      include: [
        {
          model: Help,
          include: [
            {
              model: User,
              as: "user",
              attributes: {
                exclude: ["apiKey", "token", "password"],
              },
            },
          ],
        },
        {
          model: User,
          as: "assignToUser",
          attributes: {
            exclude: ["apiKey", "token", "password"],
          },
        },
        {
          model: User,
          as: "assignByUser",
          attributes: {
            exclude: ["apiKey", "token", "password"],
          },
        },
      ],
    });
  }
  async findOne(id) {
    return await HelpTrack.findOne({
      where: { id },
      include: [
        {
          model: Help,
          include: [
            {
              model: User,
              as: "user",
              attributes: {
                exclude: ["apiKey", "token", "password"],
              },
            },
          ],
        },
        {
          model: User,
          as: "assignToUser",
          attributes: {
            exclude: ["apiKey", "token", "password"],
          },
        },
        {
          model: User,
          as: "assignByUser",
          attributes: {
            exclude: ["apiKey", "token", "password"],
          },
        },
      ],
    });
  }
  async store(req) {
    return await HelpTrack.create(req.body);
  }
  async update(id, req) {
    return await HelpTrack.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await HelpTrack.destroy({ where: { id } });
  }

  async changeStatus(id, status) {
    return await HelpTrack.update({ status }, { where: { id } });
  }

  async getHelpTrackByHelpId(id) {
    return await HelpTrack.findOne({ where: { helpId: id } });
  }
}

module.exports = new HelpTrackServices();
