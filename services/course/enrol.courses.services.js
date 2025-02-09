const {
  EnrolCourse,
  Course,
  CourseProgress,
  Section,
  Lecture,
  LectureQuiz,
  LectureResource,
  LectureContent,
  Category,
  Instructor,
  Pricing,
  Quiz,
  QuizQuestion,
  User,
  LectureArticle,
  CoursesReviews,
  Cart,
} = require("../../models");

const { Sequelize, Op } = require("sequelize");

const {
  getEnhanceCourses,
  getEnhanceCourse,
} = require("../../helpers/course.helper");

// Define common include options
const commonIncludeOptions = [
  {
    model: Course,
    include: [
      {
        model: Category,
        include: [{ model: Category, as: "ancestors" }],
        order: [[{ model: Category, as: "ancestors" }, "hierarchyLevel"]],
      },
      {
        model: Section,
        order: [["createdAt", "ASC"]],
        separate: true,
        include: [
          {
            model: CourseProgress,
            attributes: ["progress"],
            required: false,
            as: "sectionProgress",
          },
          {
            model: Lecture,
            separate: true,
            order: [["createdAt", "ASC"]],
            include: [
              {
                model: CourseProgress,
                attributes: ["progress"],
                required: false,
                as: "lectureProgress",
              },
              {
                model: LectureContent,
                separate: true,
                order: [["createdAt", "ASC"]],
                include: [
                  {
                    model: CourseProgress,
                    as: "lectureContentProgress",
                    attributes: ["progress"],
                  },
                ],
              },
              {
                model: LectureArticle,
                separate: true,
                order: [["createdAt", "ASC"]],
                include: [
                  {
                    model: CourseProgress,
                    as: "lectureArticleProgress",
                    attributes: ["progress"],
                  },
                ],
              },
              {
                model: LectureResource,
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
                model: CourseProgress,
                attributes: ["progress"],
                required: false,
                as: "quizProgress",
              },
              {
                model: QuizQuestion,
                separate: true,
                order: [["createdAt", "ASC"]],
              },
            ],
          },
        ],
      },
      {
        model: Instructor,
      },
      {
        model: Pricing,
      },
    ],
  },
];

function generateStudentFilter(query) {
  let filterValue = {
    [Op.or]: [],
  };

  for (let key in query) {
    if (key !== "offset" && key !== "limit") {
      if (User.getAttributes()[key] !== undefined) {
        if (Array.isArray(query[key])) {
          // If the query parameter is an array, use Op.or to filter for any of the values
          filterValue[Op.or].push({
            [key]: {
              [Op.or]: query[key].map((value) => ({
                [Op.like]: `%{value}%`,
              })),
            },
          });
        } else {
          // If the query parameter is a single value, filter normally
          filterValue[Op.or].push({
            [key]: {
              [Op.like]: `%${query[key]}%`,
            },
          });
        }
      }
    }
  }

  // Add the logic to combine firstname and lastname filters
  let nameFilters = [];
  if (query.firstname) {
    nameFilters.push({
      firstname: {
        [Op.like]: `%${query.firstname}%`,
      },
    });
  }
  if (query.lastname) {
    nameFilters.push({
      lastname: {
        [Op.like]: `%${query.lastname}%`,
      },
    });
  }
  if (nameFilters.length > 0) {
    filterValue[Op.or].push(...nameFilters);
  }

  // If the Op.or array is empty, remove it to avoid unnecessary filtering
  if (filterValue[Op.or].length === 0) {
    delete filterValue[Op.or];
  }

  return filterValue;
}

class EnrolCourseServices {
  async all() {
    return await EnrolCourse.findAll({
      include: [
        {
          model: Course,
        },
      ],
    });
  }

  async findOne(id) {
    return await EnrolCourse.findOne({
      where: { id },
      include: [
        {
          model: Course,
        },
      ],
    });
  }

  async findBy(by) {
    return await EnrolCourse.findOne({ where: by });
  }

  async findAllBy(by) {
    return await EnrolCourse.findAll({ where: by });
  }

  async findAllStudent(courseId, req, offset, limit) {
    // filter student
    const filterValue = generateStudentFilter(req.query);

    const { rows, count } = await EnrolCourse.findAndCountAll({
      distinct: true,
      where: { courseId },
      include: [
        {
          model: User,
          where: { ...filterValue },
          as: "user",
        },
        {
          model: Course,
          as: "course",
          include: [
            {
              model: CourseProgress,
              as: "courseProgress",
              attributes: ["progress"],
              required: false,
              where: {
                courseId,
                userId: {
                  [Sequelize.Op.eq]: Sequelize.col("enrolcourse.userId"),
                },
              },
            },
          ],
        },
      ],
      offset,
      limit,
    });

    return { rows, count };
  }

  async store(req) {
    // remove the course from cart

    const { id: userId } = req.user;
    const { courseId } = req.body;

    const create = await EnrolCourse.create(req.body);
    // remove the course id from

    if (create) {
      await Cart.destroy({
        where: {
          userId,
          courseId,
        },
      });
    }

    return create;
  }

  async update(id, req, options = {}) {
    return await EnrolCourse.update(req.body, {
      where: { id },
      ...options,
    });
  }

  async destroy(id) {
    return await EnrolCourse.destroy({ where: { id } });
  }

  async getUserCourseEnrolStatus(userId, courseId) {
    return await EnrolCourse.findOne({
      where: { userId, courseId },
      include: [
        {
          model: Course,
        },
      ],
    });
  }

  async getUserCourseByUserId(req, offset, limit, by) {
    const { userId } = by;
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (Course.rawAttributes[key]) {
          filterValue[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    const { count, rows: enrolCourses } = await EnrolCourse.findAndCountAll({
      distinct: true,
      where: { ...by, status: true },
      include: [
        {
          model: Course,
          where: { ...filterValue },
          include: [
            {
              model: CourseProgress,
              as: "courseProgress",
              attributes: ["progress"],
              where: { userId },
              required: false,
            },
            {
              model: Category,
              include: [{ model: Category, as: "ancestors" }],
              order: [[{ model: Category, as: "ancestors" }, "hierarchyLevel"]],
            },
            {
              model: Section,
              order: [["createdAt", "ASC"]],
              separate: true,
              include: [
                {
                  model: CourseProgress,
                  attributes: ["progress"],
                  required: false,
                  as: "sectionProgress",
                  where: { userId },
                },
                {
                  model: Lecture,
                  separate: true,
                  order: [["createdAt", "ASC"]],
                  include: [
                    {
                      model: CourseProgress,
                      attributes: ["progress"],
                      required: false,
                      as: "lectureProgress",
                      where: { userId },
                    },
                    {
                      model: LectureContent,
                      separate: true,
                      order: [["createdAt", "ASC"]],
                      include: [
                        {
                          model: CourseProgress,
                          required: false,
                          as: "lectureContentProgress",
                          attributes: ["progress"],
                          where: { userId },
                        },
                      ],
                    },
                    {
                      model: LectureArticle,
                      separate: true,
                      order: [["createdAt", "ASC"]],
                      include: [
                        {
                          model: CourseProgress,
                          as: "lectureArticleProgress",
                          attributes: ["progress"],
                          where: { userId },
                          required: false,
                        },
                      ],
                    },
                    {
                      model: LectureResource,
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
                      model: CourseProgress,
                      attributes: ["progress"],
                      required: false,
                      as: "quizProgress",
                      where: { userId },
                    },
                    {
                      model: QuizQuestion,
                      separate: true,
                      order: [["createdAt", "ASC"]],
                    },
                  ],
                },
              ],
            },
            {
              model: Instructor,
            },
            {
              model: Pricing,
            },
            {
              model: CoursesReviews,
              where: { userId },
              required: false,
            },
          ],
        },
      ],
      offset,
      limit,
    });

    if (!enrolCourses) {
      return { count: 0, rows: [] };
    }

    const { rows: enhancedCourses } = await getEnhanceCourses(
      count,
      enrolCourses.map((enrol) => enrol.course)
    );

    const enhancedCoursesMap = enhancedCourses.reduce((acc, course) => {
      acc[course.id] = course;
      return acc;
    }, {});

    return {
      count,
      rows: enrolCourses.map((enrol) => {
        enrol.dataValues.course = enhancedCoursesMap[enrol.course.id];

        return enrol;
      }),
    };
  }

  // user course instructors
  async getMyCourseInstructors(req, offset, limit, by) {
    const { id: instructorId } = req.query;
    // Filter the course
    const { userId } = by;

    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (Instructor.rawAttributes[key]) {
          filterValue[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    const { count, rows: enrolCourses } = await EnrolCourse.findAndCountAll({
      distinct: true,
      where: by,
      include: [
        {
          model: Course,
          include: [
            {
              model: Instructor,
              where: { id: instructorId }, // Filter by instructor ID
            },
            {
              model: CourseProgress,
              as: "courseProgress",
              attributes: ["progress"],
              where: { userId },
              required: false,
            },
            {
              model: Category,
              include: [{ model: Category, as: "ancestors" }],
              order: [[{ model: Category, as: "ancestors" }, "hierarchyLevel"]],
            },
            {
              model: Section,
              order: [["createdAt", "ASC"]],
              separate: true,
              include: [
                {
                  model: CourseProgress,
                  attributes: ["progress"],
                  required: false,
                  as: "sectionProgress",
                  where: { userId },
                },
                {
                  model: Lecture,
                  separate: true,
                  order: [["createdAt", "ASC"]],
                  include: [
                    {
                      model: CourseProgress,
                      attributes: ["progress"],
                      required: false,
                      as: "lectureProgress",
                      where: { userId },
                    },
                    {
                      model: LectureContent,
                      separate: true,
                      order: [["createdAt", "ASC"]],
                      include: [
                        {
                          model: CourseProgress,
                          attributes: ["progress"],
                          required: false,
                          as: "lectureContentProgress",
                          where: { userId },
                        },
                      ],
                    },
                    {
                      model: LectureArticle,
                      separate: true,
                      order: [["createdAt", "ASC"]],
                      include: [
                        {
                          model: CourseProgress,
                          attributes: ["progress"],
                          required: false,
                          as: "lectureArticleProgress",
                          where: { userId },
                        },
                      ],
                    },
                    {
                      model: LectureResource,
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
                      model: CourseProgress,
                      attributes: ["progress"],
                      required: false,
                      as: "quizProgress",
                      where: { userId },
                    },
                    {
                      model: QuizQuestion,
                      separate: true,
                      order: [["createdAt", "ASC"]],
                    },
                  ],
                },
              ],
            },
            {
              model: Pricing,
            },
          ],
        },
      ],
      offset,
      limit,
    });

    if (!enrolCourses) {
      return { count: 0, rows: [] };
    }

    // Fetch and enhance course details
    const { rows: enhancedCourses } = await getEnhanceCourses(
      count,
      enrolCourses.map((enrol) => enrol.course)
    );

    // Create a map of enhanced courses by their IDs
    const enhancedCoursesMap = enhancedCourses.reduce((acc, course) => {
      acc[course.id] = course;
      return acc;
    }, {});

    // Add the enhanced course details back into each enrol object
    const rows = enrolCourses.map((enrol) => {
      enrol.dataValues.course = enhancedCoursesMap[enrol.course.id];
      return enrol;
    });

    return { count, rows };
  }

  // user course progress
  async getMyCourseProgress(req, offset, limit, by) {
    let progressCondition = {};
    let courseProgressInclude = {
      model: CourseProgress,
      as: "courseProgress",
      attributes: ["progress"],
      required: false,
    };

    if (req.query.progress !== undefined) {
      if (req.query.progress == 0) {
        // For progress = 0, include CourseProgress where progress is 0 or include rows where there is no CourseProgress
        courseProgressInclude = {
          ...courseProgressInclude,
          required: false,
          where: {
            [Op.or]: [{ progress: 0 }, { progress: null }],
          },
        };
      } else if (req.query.progress < 100) {
        progressCondition = { progress: { [Op.lt]: 100 } };
        courseProgressInclude.where = progressCondition;
      } else {
        progressCondition = { progress: { [Op.eq]: req.query.progress } };
        courseProgressInclude.where = progressCondition;
      }
    }

    const { count, rows: enrolCourses } = await EnrolCourse.findAndCountAll({
      distinct: true,
      where: by,
      include: [
        {
          model: Course,
          include: [
            courseProgressInclude,
            {
              model: Category,
              include: [{ model: Category, as: "ancestors" }],
              order: [[{ model: Category, as: "ancestors" }, "hierarchyLevel"]],
            },
            {
              model: Section,
              order: [["createdAt", "ASC"]],
              separate: true,
              include: [
                {
                  model: CourseProgress,
                  attributes: ["progress"],
                  required: false,
                  as: "sectionProgress",
                },
                {
                  model: Lecture,
                  separate: true,
                  order: [["createdAt", "ASC"]],
                  include: [
                    {
                      model: CourseProgress,
                      attributes: ["progress"],
                      required: false,
                      as: "lectureProgress",
                    },
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
                      model: CourseProgress,
                      attributes: ["progress"],
                      required: false,
                      as: "quizProgress",
                    },
                    {
                      model: QuizQuestion,
                      separate: true,
                      order: [["createdAt", "ASC"]],
                    },
                  ],
                },
              ],
            },
            {
              model: Instructor,
            },
            {
              model: Pricing,
            },
          ],
        },
      ],
      offset,
      limit,
    });

    if (!enrolCourses) {
      return { count: 0, rows: [] };
    }

    // Fetch and enhance course details
    const { rows: enhancedCourses } = await getEnhanceCourses(
      count,
      enrolCourses.map((enrol) => enrol.course)
    );

    // Create a map of enhanced courses by their IDs
    const enhancedCoursesMap = enhancedCourses.reduce((acc, course) => {
      acc[course.id] = course;
      return acc;
    }, {});

    // Add the enhanced course details back into each enrol object
    const rows = enrolCourses.map((enrol) => {
      enrol.dataValues.course = enhancedCoursesMap[enrol.course.id];

      return enrol;
    });

    return { count, rows };
  }

  async findBy(by) {
    return await EnrolCourse.findOne({
      where: by,
      include: commonIncludeOptions,
    });
  }

  async findCourseEnrol(by) {
    return await EnrolCourse.findOne({
      where: by,
      include: commonIncludeOptions,
    });
  }

  // get the category of enrol instructor
  async getUserEnrolCoursesInstructors(req, offset, limit, by) {
    // filter the course
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

    const enrolCourses = await EnrolCourse.findAndCountAll({
      distinct: true,
      where: by,
      include: [
        {
          model: Course,
          where: { ...filterValue },
          include: [
            {
              model: Instructor, // Include only the Instructor model
            },
          ],
        },
      ],
      offset,
      limit,
    });

    // Extract and return only the instructors
    const instructors = enrolCourses.rows.reduce((instructors, enrolCourse) => {
      // Push each instructor into the array if it doesn't already exist
      enrolCourse.course.instructors.forEach((instructor) => {
        if (!instructors.some((i) => i.id === instructor.id)) {
          instructors.push(instructor);
        }
      });
      return instructors;
    }, []);

    const count = instructors.length;

    return { count, instructors };
  }

  // get the category of enrol courses
  async getUserEnrolCoursesCategories(req, offset, limit, by) {
    // filter the course
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

    const enrolCourses = await EnrolCourse.findAndCountAll({
      distinct: true,
      where: by,
      include: [
        {
          model: Course,
          where: { ...filterValue },
          include: [
            {
              model: Category,
              include: [{ model: Category, as: "ancestors" }],
              order: [[{ model: Category, as: "ancestors" }, "hierarchyLevel"]],
            },
          ],
        },
      ],
      offset,
      limit,
    });

    // Extract and return only the categories

    const categories = enrolCourses.rows.map(
      (enrolCourse) => enrolCourse.course.category
    );

    const count = enrolCourses.count;

    return { count, categories };
  }

  // a single user enrol
  async getSingleUserEnrol(enrolId, userId) {
    const enrol = await EnrolCourse.findOne({
      where: { id: enrolId },
      include: [
        {
          model: Course,
          include: [
            {
              model: CourseProgress,
              as: "courseProgress",
              attributes: ["progress"],
              where: { userId },
              required: false,
            },
            {
              model: Category,
              include: [{ model: Category, as: "ancestors" }],
              order: [[{ model: Category, as: "ancestors" }, "hierarchyLevel"]],
            },
            {
              model: Section,
              order: [["createdAt", "ASC"]],
              separate: true,
              include: [
                {
                  model: CourseProgress,
                  attributes: ["progress"],
                  required: false,
                  as: "sectionProgress",
                  where: { userId },
                },
                {
                  model: Lecture,
                  separate: true,
                  order: [["createdAt", "ASC"]],
                  include: [
                    {
                      model: CourseProgress,
                      attributes: ["progress"],
                      required: false,
                      as: "lectureProgress",
                      where: { userId },
                    },
                    {
                      model: LectureContent,
                      separate: true,
                      order: [["createdAt", "ASC"]],
                      include: [
                        {
                          model: CourseProgress,
                          required: false,

                          as: "lectureContentProgress",
                          attributes: ["progress"],
                          where: { userId },
                        },
                      ],
                    },
                    {
                      model: LectureArticle,
                      separate: true,
                      order: [["createdAt", "ASC"]],
                      include: [
                        {
                          model: CourseProgress,
                          as: "lectureArticleProgress",
                          attributes: ["progress"],
                          where: { userId },
                          required: false,
                        },
                      ],
                    },
                    {
                      model: LectureResource,
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
                      model: CourseProgress,
                      attributes: ["progress"],
                      required: false,
                      as: "quizProgress",
                      where: { userId },
                    },
                    {
                      model: QuizQuestion,
                      separate: true,
                      order: [["createdAt", "ASC"]],
                    },
                  ],
                },
              ],
            },
            {
              model: Instructor,
            },
            {
              model: Pricing,
            },

            {
              model: CoursesReviews,
              where: { userId },
              required: false,
            },
          ],
        },
      ],
    });

    if (!enrol) {
      return null;
    }

    const enhancedCourse = await getEnhanceCourse(enrol.course);

    enrol.dataValues.course = enhancedCourse;

    return enrol;
  }

  // user course business organizations
  async getMyCourseOrganizations(by) {
    const { userId } = by;

    const enrolCourses = await EnrolCourse.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          attributes: ["organizationName"],
        },
      ],
    });

    const organizationNames = new Set();

    enrolCourses.forEach((enrolCourse) => {
      const course = enrolCourse.dataValues.course;

      if (course && course.organizationName) {
        organizationNames.add(course.organizationName);
      }
    });

    return Array.from(organizationNames);
  }
}

module.exports = new EnrolCourseServices();
