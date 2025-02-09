const {
  Course,
  Instructor,
  Pricing,
  Quiz,
  Lecture,
  LectureContent,
  LectureResource,
  Section,
  SectionResources,
  QuizQuestion,
  Assignment,
  Category,
  Reviews,
  QuestionAnswer,
  Ratings,
  EnrolCourse,
  User,
} = require("../../models");
var geoip = require("geoip-lite");
const requestIp = require("request-ip");

// const { fn, Op, literal, Sequelize } = require("sequelize");
// const { Op, fn, col, literal, Sequelize } = require("../../database");
const { Op, fn, col, literal, Sequelize } = require("sequelize");
class QuestionAnswerService {
  async all(req, offset, limit) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (!!Course.getAttributes()[key]) {
          filterValue[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    const courses = await QuestionAnswer.Question.findAll({
      where: filterValue,
      limit,
      offset,
    });

    const courseIds = courses.map((course) => course.id);

    const aggregatedInfo = await Course.findAll({
      where: { id: courseIds },
      attributes: [
        "id", // Include the primary key or any other columns you need from the Course model
        [
          literal(
            "(SELECT COUNT(*) FROM `enrolcourses` WHERE `enrolcourses`.`courseId` = `course`.`id`)"
          ),
          "students",
        ],
        [
          literal(
            "(SELECT COUNT(*) FROM `reviews` WHERE `reviews`.`courseId` = `course`.`id`)"
          ),
          "reviews",
        ],
        [
          literal(
            "(SELECT SUM(`ratings`.`rating`) FROM `ratings` WHERE `ratings`.`courseId` = `course`.`id`)"
          ),
          "totalRating",
        ],

        [fn("COUNT", col("ratings.id")), "ratingsCount"],
      ],
      include: [
        {
          model: Ratings,
          attributes: [],
        },
      ],
      group: ["course.id"],
    });

    const result = courses.map((course) => {
      const aggregated = aggregatedInfo.find((info) => info.id === course.id);

      const totalRating = aggregated ? aggregated.dataValues.totalRating : 0;
      const ratingsCount = aggregated ? aggregated.dataValues.ratingsCount : 0;

      return {
        ...course.toJSON(),
        students: aggregated ? aggregated.dataValues.students : 0,
        reviews: aggregated ? aggregated.dataValues.reviews : 0,
        ratings: Math.ceil(totalRating / ratingsCount),
      };
    });

    return { count: result.length, rows: result };
  }

  async findOne(id) {
    return await QuestionAnswer.Question.findOne({ where: { id } });
  }

  async findOneAnswer(id) {
    return await QuestionAnswer.Answer.findOne({ where: { id } });
  }

  async findOneInclude(id) {
    return await QuestionAnswer.Question.findOne({
      where: { id },
      include: [{ model: QuestionAnswer.Answer }],
    });
  }

  async findAllInclude(id) {
    return await QuestionAnswer.Question.findAll({
      where: { courseId: id },
      include: [{ model: QuestionAnswer.Answer }, { model: User, as: "user" }],
    });
  }

  async findBy(userId) {
    const course = await Course.findAll({
      where: { userId },
      include: [
        {
          model: Category,
          include: [{ model: Category, as: "ancestors" }],
          order: [[{ model: Category, as: "ancestors" }, "hierarchyLevel"]],
        },
        {
          model: Section,
          order: [["createdAt", "ASC"]],
          include: [
            {
              model: Lecture,
              separate: true,
              order: [["createdAt", "ASC"]],
              include: [
                {
                  model: LectureContent,
                  separate: true,
                  order: [["createdAt", "ASC"]],
                },
                {
                  model: LectureResource,
                  separate: true,
                  order: [["createdAt", "ASC"]],
                },
              ],
            },
            {
              model: Quiz,
              separate: true,
              order: [["createdAt", "ASC"]],

              include: [
                {
                  model: QuizQuestion,
                  separate: true,
                  order: [["createdAt", "ASC"]],
                },
              ],
            },
          ],
          separate: true,
        },
        {
          model: Instructor,
        },
        {
          model: Pricing,
        },
      ],
    });

    if (!course) {
      // Handle the case where no course is found with the specified id
      return [];
    }

    const courseIds = [course.id]; // Wrap the single course id in an array
    const aggregatedInfo = await Course.findAll({
      where: { id: courseIds },
      attributes: [
        "id",
        [
          literal(
            "(SELECT COUNT(*) FROM `enrolcourses` WHERE `enrolcourses`.`courseId` = `course`.`id`)"
          ),
          "students",
        ],
        [
          literal(
            "(SELECT COUNT(*) FROM `reviews` WHERE `reviews`.`courseId` = `course`.`id`)"
          ),
          "reviews",
        ],
        [
          literal(
            "(SELECT SUM(`ratings`.`rating`) FROM `ratings` WHERE `ratings`.`courseId` = `course`.`id`)"
          ),
          "totalRating",
        ],
        [fn("COUNT", col("ratings.id")), "ratingsCount"],
      ],
      include: [
        {
          model: Ratings,
          attributes: [],
        },
      ],
      group: ["course.id"],
    });

    const result = courseIds.map((courseId) => {
      const aggregated = aggregatedInfo.find((info) => info.id === courseId);

      const totalRating = aggregated ? aggregated.dataValues.totalRating : 0;
      const ratingsCount = aggregated ? aggregated.dataValues.ratingsCount : 0;

      return {
        ...course.toJSON(),
        students: aggregated ? aggregated.dataValues.students : 0,
        reviews: aggregated ? aggregated.dataValues.reviews : 0,
        ratings: Math.ceil(totalRating / ratingsCount),
      };
    });

    return result;
  }

  async store(req) {
    const { title, body, category, courseId, userId } = req.body;

    return await QuestionAnswer.Question.create({
      title,
      body,
      userId: userId,
      category,
      courseId,
    });
  }
  async storeAnswer(req) {
    const { body, questionId, userId } = req.body;

    return await QuestionAnswer.Answer.create({
      body,
      userId: userId,
      questionId,
    });
  }

  async update(id, req) {
    return await QuestionAnswer.Question.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Course.destroy({ where: { id } });
  }

  async findBy(userId) {
    return await Course.findAll({
      where: { userId },
      include: [
        {
          model: Category,

          include: [{ model: Category, as: "ancestors" }],
          order: [[{ model: Category, as: "ancestors" }, "hierarchyLevel"]],
        },
        {
          model: Section,
          order: [["createdAt", "ASC"]],
          include: [
            {
              model: Lecture,
              include: [
                {
                  model: LectureContent,
                },
                {
                  model: LectureResource,
                },
              ],
              order: [["createdAt", "ASC"]],
            },
            {
              model: Quiz,
              include: [
                {
                  model: QuizQuestion,
                },
              ],
            },
          ],
          separate: true,
        },
        {
          model: Ratings,
          attributes: [],
        },
        {
          model: Reviews,
        },
        {
          model: EnrolCourse,
          attributes: [],
        },
        { model: Pricing },
      ],

      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("enrolcourses.courseId")),
            "students",
          ],
          [
            Sequelize.fn("COUNT", Sequelize.col("reviews.courseId")),
            "reviewsCount",
          ],

          [
            Sequelize.fn("AVG", Sequelize.col("ratings.rating")),
            "ratingsCount",
          ],
        ],
      },
      group: ["course.id", "enrolcourses.courseId"],
      subQuery: false,
    });
  }
}

module.exports = new QuestionAnswerService();
