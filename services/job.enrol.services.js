const { JobEnrol, User, Jobs } = require("../models");
const { Op } = require("sequelize");

class JobEnrolServices {
  async all(req, offset, limit) {
    // paginate it
    let jobEnrolFilter = {};
    let jobsFilter = {};

    const jobEnrolAttributes = JobEnrol.getAttributes();
    const jobsAttributes = Jobs.getAttributes();

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        // Check if the key exists in JobEnrol model's attributes
        if (jobEnrolAttributes[key]) {
          jobEnrolFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }

        // Check if the key exists in Jobs model's attributes
        if (jobsAttributes[key]) {
          jobsFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    return await JobEnrol.findAndCountAll({
      distinct: true,
      where: jobEnrolFilter,
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Jobs,
          where: { ...jobsFilter },
        },
      ],
      limit,
      offset,
    });
  }

  async findOne(id) {
    return await JobEnrol.findOne({
      where: { id },
      include: [{ model: User, as: "user" }, Jobs],
    });
  }

  async findAllBy(by) {
    return await JobEnrol.findAll({
      where: by,
      include: [{ model: User, as: "user" }, Jobs],
    });
  }

  async findBy(by) {
    return await JobEnrol.findOne({
      where: by,
      include: [{ model: User, as: "user" }, Jobs],
    });
  }

  async store(req) {
    return await JobEnrol.create(req.body);
  }

  async update(id, req) {
    return await JobEnrol.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await JobEnrol.destroy({ where: { id } });
  }

  async findBusinessJobs(businessId, offset, limit, req) {
    let jobEnrolFilter = {};
    let jobsFilter = {};

    const jobEnrolAttributes = JobEnrol.getAttributes();
    const jobsAttributes = Jobs.getAttributes();

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (jobEnrolAttributes[key]) {
          jobEnrolFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }

        // Check if the key  in Jobs model's attributes
        if (jobsAttributes[key]) {
          jobsFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    return await Jobs.findAndCountAll({
      distinct: true,
      where: { businessId, ...jobsFilter },
      include: [
        {
          model: JobEnrol,
          where: { ...jobEnrolFilter },
        },
      ],
      offset,
      limit,
    });
  }

  async findUserJobs(userId, offset, limit, req) {
    let jobEnrolFilter = {};
    let jobsFilter = {};

    const jobEnrolAttributes = JobEnrol.getAttributes();
    const jobsAttributes = Jobs.getAttributes();

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (jobEnrolAttributes[key]) {
          jobEnrolFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }

        if (jobsAttributes[key]) {
          jobsFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    return await JobEnrol.findAndCountAll({
      distinct: true,
      where: { userId, ...jobEnrolFilter },
      include: [
        {
          model: Jobs,
          where: { ...jobsFilter },
        },
      ],
      offset,
      limit,
    });
  }

  async findMyEnrolJobs(userId, offset, limit, req) {
    let jobEnrolFilter = {};
    let jobsFilter = {};

    const jobEnrolAttributes = JobEnrol.getAttributes();
    const jobsAttributes = Jobs.getAttributes();

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (jobEnrolAttributes[key]) {
          jobEnrolFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }

        if (jobsAttributes[key]) {
          jobsFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    return await JobEnrol.findAndCountAll({
      distinct: true,
      where: {
        userId,
        ...jobEnrolFilter,
      },
      include: [
        {
          model: Jobs,
          where: { ...jobsFilter },
        },
      ],
      offset,
      limit,
    });
  }
}

module.exports = new JobEnrolServices();
