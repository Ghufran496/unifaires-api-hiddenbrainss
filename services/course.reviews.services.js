const { literal, Sequelize } = require("sequelize");
const sequelize = require("sequelize");

const { CoursesReviews, Course, User, Business } = require("../models");
const { Op } = require("sequelize");
class CoursesReviewsServices {
  async all() {
    return await CoursesReviews.findAll({
      include: [
        {
          model: Course,
        },
        {
          model: User,
          attributes: ["id", "firstname", "lastname", "othername", "imageUrl"],
        },
      ],
    });
  }

  async findOne(id) {
    return await CoursesReviews.findOne({
      where: { id },
      include: [
        {
          model: Course,
        },
        {
          model: User,
          attributes: ["id", "firstname", "lastname", "othername", "imageUrl"],
        },
      ],
    });
  }

  async store(req) {
    return await CoursesReviews.create(req.body);
  }

  async update(id, req) {
    return await CoursesReviews.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await CoursesReviews.destroy({ where: { id } });
  }

  async courseUserReview(req, courseId) {
    return await CoursesReviews.findOne({
      where: {
        courseId,
        [Op.and]: [{ userId: req.user.id }, { courseId }],
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstname", "lastname", "othername", "imageUrl"],
        },
        {
          model: Business,
        },
      ],
    });
  }

  async courseReviews(courseId, req, offset, limit) {
    // filter course reviews
    let filterValue = {};
    const query = req.query;

    for (let key in query) {
      if (key !== "offset" && key !== "limit") {
        if (!!CoursesReviews.getAttributes()[key]) {
          if (Array.isArray(query[key])) {
            // If the query parameter is an array, use Op.or to filter for any of the values
            filterValue[key] = {
              [Op.or]: query[key].map((value) => ({
                [Op.like]: `%${value}%`,
              })),
            };
          } else {
            // If the query parameter is a single value, filter normally
            filterValue[key] = {
              [Op.like]: `%${query[key]}%`,
            };
          }
        }
      }
    }

    const ratingCounts = await Promise.all(
      [1, 2, 3, 4, 5].map((rating) =>
        CoursesReviews.count({
          where: {
            courseId,
            rating,
            ...filterValue,
          },
        })
      )
    );

    const [one, two, three, four, five] = ratingCounts;

    const { count, rows } = await CoursesReviews.findAndCountAll({
      distinct: true,
      where: { courseId, ...filterValue },
      offset,
      limit,
      include: [
        {
          model: User,
          attributes: ["id", "firstname", "lastname", "othername", "imageUrl"],
        },
        {
          model: Business,
        },
      ],
    });

    return {
      reviews: rows,
      count,
      ratingsCount: { one, two, three, four, five },
    };
  }
}

module.exports = new CoursesReviewsServices();
