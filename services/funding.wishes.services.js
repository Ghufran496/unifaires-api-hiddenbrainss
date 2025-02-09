const { FundingWishes, User, Funding } = require("../models");

class FundingWishesServices {
  async all(req, offset, limit) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        filterValue[key] = {
          [Op.like]: `%${req.query[key]}%`,
        };
      }
    }

    return await FundingWishes.findAndCountAll({
      distinct: true,
      where: filterValue,
      limit,
      offset,
      include: [
        {
          model: Funding,
          where: filterValue,
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
  }

  async findOne(id) {
    return await FundingWishes.findOne({
      where: { id },
      include: [
        {
          model: Funding,
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
  }

  async findBy(by) {
    return await FundingWishes.findOne({
      where: by,
      include: [
        {
          model: Funding,
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
  }

  async store(req) {
    return await FundingWishes.create(req.body);
  }
  async update(id, req) {
    return await FundingWishes.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await FundingWishes.destroy({ where: { id } });
  }

  async getUserWished(req) {
    return await FundingWishes.findOne({
      where: { userId: req.user.id, jobId: req.body.jobId },
    });
  }

  async getUsersWishes(req, offset, limit, userId) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        filterValue[key] = {
          [Op.like]: `%${req.query[key]}%`,
        };
      }
    }

    return await FundingWishes.findAndCountAll({
      distinct: true,
      where: { userId },
      limit,
      offset,
      include: [
        {
          model: Funding,
          where: filterValue,
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
  }
}

module.exports = new FundingWishesServices();
