const {
  Course,
  Instructor,
  Pricing,
  Quiz,
  Lecture,
  LectureContent,
  LectureResource,
  Section,
  QuizQuestion,
  Category,
  LectureQuiz,
  CoursesReviews,
  LectureArticle,
  Skills,
  User,
  Social,
  Business,
} = require("../../models");

const { Op, Sequelize, literal } = require("sequelize");

const dayjs = require("dayjs");

const {
  getEnhanceCourse,
  getEnhanceCourses,
} = require("../../helpers/course.helper");

// Common includes for Courses
const commonCourseIncludes = [
  {
    model: Category,
    include: [{ model: Category, as: "ancestors" }],
    order: [[{ model: Category, as: "ancestors" }, "hierarchyLevel"]],
  },
  {
    model: Skills,
    as: "skills",
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
          {
            model: LectureArticle,
            separate: true,
            order: [["createdAt", "ASC"]],
          },
          {
            model: LectureQuiz,
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
  {
    model: CoursesReviews,
    limit: 20,
    order: [["createdAt", "DESC"]],
  },
];

const categoryCommonCourseIncludes = [
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
          {
            model: LectureArticle,
            separate: true,
            order: [["createdAt", "ASC"]],
          },
          {
            model: LectureQuiz,
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
    where: {
      id: { [Sequelize.Op.ne]: null },
    },
  },
  {
    model: CoursesReviews,
    limit: 20,
    order: [["createdAt", "DESC"]],
  },
];

const skillsCommonCourseIncludes = [
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
          {
            model: LectureArticle,
            separate: true,
            order: [["createdAt", "ASC"]],
          },
          {
            model: LectureQuiz,
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
    where: {
      id: { [Sequelize.Op.ne]: null },
    },
  },

  {
    model: CoursesReviews,
    limit: 20,
    order: [["createdAt", "DESC"]],
  },
];

// Helper function to generate filter values from query parameters
function generateFilterValue(query) {
  let filterValue = {};

  for (let key in query) {
    if (key !== "offset" && key !== "limit" && key !== "page") {
      if (key === "applicationDeadline") {
        // Handle date range for applicationDeadline
        const dates = Array.isArray(query[key]) ? query[key] : [query[key]];
        if (dates.length === 1) {
          const parsedDate = dayjs(dates[0], "DD/MM/YYYY").format("YYYY-MM-DD");
          filterValue[key] = {
            [Op.eq]: parsedDate,
          };
        } else if (dates.length === 2) {
          const startDate = dayjs(dates[0], "DD/MM/YYYY").format("YYYY-MM-DD");
          const endDate = dayjs(dates[1], "DD/MM/YYYY").format("YYYY-MM-DD");
          filterValue[key] = {
            [Op.between]: [startDate, endDate],
          };
        }
      } else if (key === "averageRating") {
        // Handle filtering by averageRating
        const ratingQuery = query[key];
        filterValue[Op.and] = filterValue[Op.and] || [];
        filterValue[Op.and].push(
          literal(`
            (
              SELECT
                (COALESCE(SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END), 0) * 1 +
                 COALESCE(SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END), 0) * 2 +
                 COALESCE(SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END), 0) * 3 +
                 COALESCE(SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END), 0) * 4 +
                 COALESCE(SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END), 0) * 5
                ) / NULLIF(COUNT(*), 0)
              FROM \`coursesreviews\`
              WHERE \`coursesreviews\`.\`courseId\` = \`course\`.\`id\`
            ) >= ${ratingQuery}
          `)
        );
      } else if (Array.isArray(query[key])) {
        filterValue[key] = {
          [Op.or]: query[key].map((value) => ({
            [Op.like]: `%${value}%`,
          })),
        };
      } else if (key === "pricing") {
      } else {
        // If the query parameter is a single value, filter normally
        filterValue[key] = {
          [Op.like]: `%${query[key]}%`,
        };
      }
    }
  }

  return filterValue;
}

function generateCategoryFilterValue(query) {
  let filterValue = {};

  for (let key in query) {
    if (key !== "offset" && key !== "limit" && key !== "page") {
      if (key === "category") {
        if (Array.isArray(query[key])) {
          filterValue["name"] = {
            [Op.or]: query[key].map((value) => ({
              [Op.like]: `%${value}%`,
            })),
          };
        } else {
          filterValue["name"] = {
            [Op.like]: `%${query[key]}%`,
          };
        }
      }
    }
  }

  return filterValue;
}

function generateSkillsFilterValue(query) {
  let filterValue = {};

  for (let key in query) {
    if (key !== "offset" && key !== "limit") {
      if (key === "skills") {
        if (Array.isArray(query[key])) {
          filterValue["name"] = {
            [Op.or]: query[key].map((value) => ({
              [Op.like]: `%${value}%`,
            })),
          };
        } else {
          filterValue["name"] = {
            [Op.like]: `%${query[key]}%`,
          };
        }
      }
    }
  }

  return filterValue;
}

class CourseServices {
  async all(req, offset, limit) {
    let filterValue = generateFilterValue(req.query);
    let categoryFilterValue = generateCategoryFilterValue(req.query);
    let skillsFilterValue = generateSkillsFilterValue(req.query);

    const { count, rows: courses } = await Course.findAndCountAll({
      where: { ...filterValue, status: "active" },
      order: [["createdAt", "DESC"]],
      distinct: true,
      limit,
      offset,
      include: [
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
                {
                  model: LectureArticle,
                  separate: true,
                  order: [["createdAt", "ASC"]],
                },
                {
                  model: LectureQuiz,
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
          required: false,
          where: {
            id: { [Sequelize.Op.ne]: null },
            ...(req.query.pricing && { type: req.query.pricing }),
          },
        },
        {
          model: CoursesReviews,
          limit: 20,
          order: [["createdAt", "DESC"]],
        },
        {
          model: Category,
          include: [{ model: Category, as: "ancestors" }],
          order: [[{ model: Category, as: "ancestors" }, "hierarchyLevel"]],
          where: { ...categoryFilterValue },
        },
        {
          model: Skills,
          as: "skills",
          where: { ...skillsFilterValue },
        },
        {
          model: User,
          as: "user",
          required: false,
          attributes: ["username", "firstname", "lastname"],
          include: {
            model: Social,
            as: "userSocials",
          },
        },
        {
          model: Business,
          as: "business",
          required: false,
          attributes: ["username", "firstname", "lastname"],
          include: {
            model: Social,
            as: "businessSocials",
          },
        },
      ],
    });

    return await getEnhanceCourses(count, courses);
  }

  async adminAll(req, offset, limit) {
    let filterValue = generateFilterValue(req.query);

    const { count, rows: courses } = await Course.findAndCountAll({
      distinct: true,
      where: { ...filterValue },
      limit,
      offset,
      include: [...commonCourseIncludes],
    });

    return await getEnhanceCourses(count, courses);
  }

  async findOne(id) {
    const course = await Course.findOne({
      where: { id },
      include: [...commonCourseIncludes],
    });

    if (!course) {
      // Handle the case where no course is found with the specified id
      return null;
    }

    return await getEnhanceCourse(course);
  }

  async findBy(by, options = {}) {
    const course = await Course.findOne({
      where: by,
      include: commonCourseIncludes,
      ...options,
    });

    if (!course) {
      return null;
    }

    return await getEnhanceCourse(course);
  }

  async findAllCourseBy(req, by, offset, limit) {
    let filterValue = generateFilterValue(req.query);

    const { count, rows: courses } = await Course.findAndCountAll({
      distinct: true,
      where: { ...by, ...filterValue },
      limit,
      offset,
      include: [...commonCourseIncludes],
      order: [["createdAt", "DESC"]],
    });

    return await getEnhanceCourses(count, courses);
  }

  async findAllBy(by) {
    const { count, rows: courses } = await Course.findAndCountAll({
      distinct: true,
      where: by,
      include: commonCourseIncludes,
    });

    if (!courses) return [];

    return await getEnhanceCourses(count, courses);
  }

  async store(req, transaction) {
    return await Course.create(
      { ...req.body },
      {
        transaction,
      }
    );
  }

  async update(id, req) {
    return await Course.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Course.destroy({ where: { id } });
  }

  async coursePrices(courseIds) {
    const courses = await Course.findAll({
      where: {
        id: {
          [Op.in]: courseIds,
        },
      },
      include: Pricing,
    });

    return courses;
  }

  async skillsCourses(req, skills, offset, limit) {
    let filterValue = generateFilterValue(req.query);
    let skillIds = skills || [];

    let { count, rows: courses } = await Course.findAndCountAll({
      distinct: true,
      where: {
        status: "active",
        ...filterValue,
      },
      limit,
      offset,
      include: [
        ...skillsCommonCourseIncludes,
        {
          model: Skills,
          as: "skills",
          where: {
            id: {
              [Sequelize.Op.in]: skillIds,
            },
          },
          required: true,
        },
      ],
    });

    return await getEnhanceCourses(count, courses);
  }

  async associateFreeCourses(userIds, businessIds) {
    const { count, rows } = await Course.findAndCountAll({
      distinct: true,
      where: {
        [Op.or]: [
          { businessId: { [Op.in]: businessIds } },
          { userId: { [Op.in]: userIds } },
        ],
        isAssociateFree: true,
      },
    });

    return { count, rows };
  }

  // leve of education
  async courseLevelOfEducationDistinct() {
    return Course.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("levelsOfEducation")),
          "levelsOfEducation",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "courseCount"],
      ],
      where: {
        levelsOfEducation: {
          [Sequelize.Op.not]: null,
        },
      },
      group: ["levelsOfEducation"],
    });
  }

  // program start date
  async programStartDate() {
    return Course.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("programStartDate")),
          "programStartDate",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "courseCount"],
      ],
      where: {
        programStartDate: {
          [Sequelize.Op.not]: null,
        },
      },
      group: ["programStartDate"],
    });
  }

  // qualification type
  async qualificationType() {
    return Course.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("qualificationType")),
          "qualificationType",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "courseCount"],
      ],
      where: {
        qualificationType: {
          [Sequelize.Op.not]: null,
        },
      },
      group: ["qualificationType"],
    });
  }

  // course level
  async courseLevel() {
    return Course.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("level")), "level"],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "courseCount"],
      ],
      where: {
        level: {
          [Sequelize.Op.not]: null,
        },
      },
      group: ["level"],
    });
  }

  // course subtitle
  async courseSubTitle() {
    return Course.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("subtitleLanguage")),
          "subtitleLanguage",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "courseCount"],
      ],
      where: {
        subtitleLanguage: {
          [Sequelize.Op.not]: null,
        },
      },
      group: ["subtitleLanguage"],
    });
  }

  // course study pace
  async courseStudyPace() {
    return Course.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("studyPace")), "studyPace"],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "courseCount"],
      ],
      where: {
        studyPace: {
          [Sequelize.Op.not]: null,
        },
      },
      group: ["studyPace"],
    });
  }

  // course study mode
  async courseStudyMode() {
    return Course.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("studyMode")), "studyMode"],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "courseCount"],
      ],
      where: {
        studyMode: {
          [Sequelize.Op.not]: null,
        },
      },
      group: ["studyMode"],
    });
  }

  // course study pace
  async courseLang() {
    return Course.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("lang")), "lang"],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "courseCount"],
      ],
      where: {
        lang: {
          [Sequelize.Op.not]: null,
        },
      },
      group: ["lang"],
    });
  }

  // course study type
  async courseProgramType() {
    return Course.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("programType")), "programType"],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "courseCount"],
      ],
      where: {
        programType: {
          [Sequelize.Op.not]: null,
        },
      },
      group: ["programType"],
    });
  }

  // course study type
  async courseProgramRanking() {
    return Course.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("programRanking")),
          "programRanking",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "courseCount"],
      ],
      where: {
        programRanking: {
          [Sequelize.Op.not]: null,
        },
      },
      group: ["programRanking"],
    });
  }

  // all attributes
  async getAllDistinctAttributes() {
    const attributes = [
      "qualificationType",
      "level",
      "subtitleLanguage",
      "studyPace",
      "studyMode",
      "lang",
      "programType",
      "programRanking",
      "organizationName",
    ];

    const results = {};

    for (const attribute of attributes) {
      results[attribute] = await Course.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col(attribute)), attribute],
          [Sequelize.fn("COUNT", Sequelize.col("*")), "courseCount"],
        ],
        where: {
          [attribute]: {
            [Sequelize.Op.not]: null,
          },
        },
        group: [attribute],
      });
    }

    return results;
  }
}

module.exports = new CourseServices();
