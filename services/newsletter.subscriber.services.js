const { NewsLetterSubscriber } = require("../models");
const { Op } = require("sequelize");

class NewsLetterSubscriberServices {
  async all(req, offset, limit) {
    let filterValue = {};

    const { query } = req;
    for (let key in query) {
      if (key !== "offset" && key !== "limit") {
        if (!!NewsLetterSubscriber.getAttributes()[key]) {
          if (Array.isArray(query[key])) {
            filterValue[key] = {
              [Op.or]: query[key].map((value) => ({
                [Op.like]: `%${value}%`,
              })),
            };
          } else {
            filterValue[key] = {
              [Op.like]: `%${query[key]}%`,
            };
          }
        }
      }
    }

    return await NewsLetterSubscriber.findAndCountAll({
      distinct: true,
      where: {
        ...filterValue,
      },

      offset,
      limit,
    });
  }

  async findOne(id) {
    return await NewsLetterSubscriber.findOne({ where: { id } });
  }

  async findBy(by) {
    return await NewsLetterSubscriber.findOne({ where: by });
  }

  async findAllBy(by) {
    return await NewsLetterSubscriber.findOne({ where: by });
  }

  async store(req) {
    return await NewsLetterSubscriber.create(req.body);
  }

  async update(id, req) {
    return await NewsLetterSubscriber.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await NewsLetterSubscriber.destroy({ where: { id } });
  }

  async exportAll() {
    return await NewsLetterSubscriber.findAll({
      attributes: ["email"],
      distinct: true,
    });
  }
}

module.exports = new NewsLetterSubscriberServices();
