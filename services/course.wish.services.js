const { CourseWish, Course, User } = require("../models");
const { Op } = require("sequelize");

class CourseWishServices {
  async all(req, offset, limit) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        filterValue[key] = {
          [Op.like]: `%${req.query[key]}%`,
        };
      }
    }

    return await CourseWish.findAndCountAll({
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
    return await CourseWish.findOne({
      where: { id },
      include: [{ model: Course }, { model: User, as: "user" }],
    });
  }
  async findBy(by) {
    return await CourseWish.findOne({
      where: by,
      include: [{ model: Course }, { model: User, as: "user" }],
    });
  }
  async store(req) {
    return await CourseWish.create(req.body);
  }
  async update(id, req) {
    return await CourseWish.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await CourseWish.destroy({ where: { id } });
  }

  async getUserWished(by, courseId) {
    return await CourseWish.findOne({
      where: { ...by, courseId },
    });
  }

  async getUsersWishes(req, offset, limit, by) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        filterValue[key] = {
          [Op.like]: `%${req.query[key]}%`,
        };
      }
    }

    return await CourseWish.findAndCountAll({
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

module.exports = new CourseWishServices();
