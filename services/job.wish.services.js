const { JobWish, Jobs, User } = require("../models");

class JobWishServices {
  async all(req, offset, limit) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        filterValue[key] = {
          [Op.like]: `%${req.query[key]}%`,
        };
      }
    }

    return await JobWish.findAndCountAll({
      distinct: true,
      where: filterValue,
      limit,
      offset,
      include: [
        {
          model: Jobs,
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
    return await JobWish.findOne({
      where: { id },
      include: [
        {
          model: Jobs,
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
  }

  async findBy(by) {
    return await JobWish.findOne({
      where: by,
      include: [
        {
          model: Jobs,
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
  }

  async store(req) {
    return await JobWish.create(req.body);
  }
  async update(id, req) {
    return await JobWish.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await JobWish.destroy({ where: { id } });
  }

  async getUserWished(req) {
    return await JobWish.findOne({
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

    return await JobWish.findAndCountAll({
      distinct: true,
      where: { userId },
      limit,
      offset,
      include: [
        {
          model: Jobs,
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

module.exports = new JobWishServices();
