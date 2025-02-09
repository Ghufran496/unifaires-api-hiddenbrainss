const { CourseArchieve, Course, User } = require("../models");
const { Op } = require("sequelize");

class CourseArchieveServices {
  async all(req, offset, limit) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        filterValue[key] = {
          [Op.like]: `%${req.query[key]}%`,
        };
      }
    }

    return await CourseArchieve.findAndCountAll({
      distinct: true,
      where: filterValue,
      limit,
      offset,
      include: [
        {
          model: Course,
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
    return await CourseArchieve.findOne({
      where: { id },
      include: [{ model: Course }, { model: User, as: "user" }],
    });
  }
  async findBy(by) {
    return await CourseArchieve.findOne({
      where: by,
      include: [{ model: Course }, { model: User, as: "user" }],
    });
  }

  async store(req, options = {}) {
    return await CourseArchieve.create(req.body, options);
  }

  async update(id, req) {
    return await CourseArchieve.update(req.body, { where: { id } });
  }

  async destroy(id, options = {}) {
    return await CourseArchieve.destroy({
      where: { id },
      ...options,
    });
  }

  async getUserArchieved(by, courseId) {
    // check if user or business

    if (by.userId) {
      return await CourseArchieve.findOne({
        where: { userId: by.userId, courseId },
      });
    } else if (by.businessId) {
      return await CourseArchieve.findOne({
        where: { businessId: by.businessId, courseId },
      });
    }
  }

  async getUserAchieves(req, offset, limit, by) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        filterValue[key] = {
          [Op.like]: `%${req.query[key]}%`,
        };
      }
    }

    return await CourseArchieve.findAndCountAll({
      distinct: true,
      where: by,
      limit,
      offset,
      include: [
        {
          model: Course,
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

module.exports = new CourseArchieveServices();
