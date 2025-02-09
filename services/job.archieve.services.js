const { JobArchieve, Jobs, User } = require("../models");

class JobArchieveService {
  async all(req, offset, limit) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        filterValue[key] = {
          [Op.like]: `%${req.query[key]}%`,
        };
      }
    }

    return await JobArchieve.findAndCountAll({
      distinct: true,
      where: filterValue,
      limit,
      offset,
      include: [
        {
          model: Jobs,
          where: filterValue,
        },
      ],
    });
  }

  async findOne(id) {
    return await JobArchieve.findOne({
      where: { id },
      include: [
        {
          model: Jobs,
        },
      ],
    });
  }

  async findBy(by) {
    return await JobArchieve.findOne({
      where: by,
      include: [
        {
          model: Jobs,
        },
      ],
    });
  }
  async store(req) {
    return await JobArchieve.create(req.body);
  }
  async update(id, req) {
    return await JobArchieve.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await JobArchieve.destroy({ where: { id } });
  }

  async getUserArchieved(req) {
    return await JobArchieve.findOne({
      where: { userId: req.user.id, jobId: req.body.jobId },
    });
  }

  async getUsersArchieves(req, offset, limit, userId) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        filterValue[key] = {
          [Op.like]: `%${req.query[key]}%`,
        };
      }
    }

    return await JobArchieve.findAndCountAll({
      distinct: true,
      where: { userId },
      limit,
      offset,
      include: [
        {
          model: Jobs,
          where: filterValue,
        },
      ],
    });
  }

  async getBusinessArchieves(req, offset, limit, businessId) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        filterValue[key] = {
          [Op.like]: `%${req.query[key]}%`,
        };
      }
    }

    return await JobArchieve.findAndCountAll({
      distinct: true,
      where: { businessId },
      limit,
      offset,
      include: [
        {
          model: Jobs,
          where: filterValue,
        },
      ],
    });
  }
}

module.exports = new JobArchieveService();
