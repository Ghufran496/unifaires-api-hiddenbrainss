const { utils, useAsync } = require("../core");
const {
  Transactions,
  Course,
  EnrolCourse,
  CourseProgress,
  Jobs,
  JobEnrol,
  Funding,
  FundingEnrol,
} = require("../models");
const courseServices = require("../services/course/course.services");
const { JParser } = utils;
const { Op, fn, col, Sequelize, where } = require("sequelize");
const jobServices = require("../services/jobs.services");

const fundingServices = require("../services/funding.services");

const { User } = require("../models");

exports.user_demography = useAsync(async (req, res, next) => {
  try {
    let filterValue = {};

    // Parse filter values from the request query
    for (let key in req.query) {
      if (
        key !== "offset" &&
        key !== "limit" &&
        key !== "startWeek" &&
        key !== "endWeek" &&
        key !== "filterType"
      ) {
        if (!!User.getAttributes()[key]) {
          if (Array.isArray(req.query[key])) {
            filterValue[key] = {
              [Op.or]: req.query[key].map((value) => ({
                [Op.like]: `%${value}%`,
              })),
            };
          } else {
            filterValue[key] = {
              [Op.like]: `%${req.query[key]}%`,
            };
          }
        }
      }
    }

    const now = new Date();
    const endWeek = parseInt(req.query.endWeek) || 0;
    const filterType = req.query.filterType || "week"; // Default to week
    const range = 10;

    let weeklyData = [];

    for (let i = 0; i < range; i++) {
      let startDate, endDate, periodLabel, month;

      if (filterType === "month") {
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - (endWeek + i),
          1
        );
        endDate = new Date(
          now.getFullYear(),
          now.getMonth() - (endWeek + i + 1),
          1
        );
        periodLabel = startDate.toLocaleString("default", { month: "long" });
        month = periodLabel;
      } else {
        startDate = new Date(
          now.getTime() - (endWeek + i) * 7 * 24 * 60 * 60 * 1000
        );
        endDate = new Date(
          now.getTime() - (endWeek + i + 1) * 7 * 24 * 60 * 60 * 1000
        );
        periodLabel = `Week ${endWeek + i}`;
        month = startDate.toLocaleString("default", { month: "long" });
      }

      const newUsers = await User.count({
        where: {
          ...filterValue,
          createdAt: {
            [Op.between]: [endDate, startDate],
          },
        },
      });

      const returningUsers = await User.count({
        where: {
          ...filterValue,
          createdAt: {
            [Op.lt]: endDate,
          },
          updatedAt: {
            [Op.between]: [endDate, startDate],
          },
        },
      });

      weeklyData.push({
        period: periodLabel,
        newUsers: newUsers,
        returningUsers: returningUsers,
        month: month,
      });
    }

    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalNewUsers = await User.count({
      where: {
        ...filterValue,
        createdAt: {
          [Op.between]: [oneWeekAgo, now],
        },
      },
    });

    const totalReturningUsers = await User.count({
      where: {
        ...filterValue,
        createdAt: {
          [Op.lt]: oneWeekAgo,
        },
      },
    });

    return res.status(200).json(
      JParser("ok-response", true, {
        weeklyData: weeklyData,
        totalNew: totalNewUsers,
        totalReturning: totalReturningUsers,
      })
    );
  } catch (error) {
    next(error);
  }
});

/* get business course stats */
exports.business_courses = useAsync(async (req, res, next) => {
  try {
    const { id: businessId } = req.business;

    // total amount
    const totalAmount = await Transactions.sum("amount", {
      where: {
        paidFor: "course",
      },
      include: [
        {
          model: Course,
          as: "course",
          attributes: [],
          where: {
            businessId,
          },
        },
      ],
    });
    const totalRevenue = totalAmount || 0;

    // total students
    const students = await EnrolCourse.count({
      include: [
        {
          model: Course,
          where: {
            businessId,
          },
        },
      ],
    });

    // country stats
    const countryStats = await EnrolCourse.findAll({
      attributes: [
        [col("user.country"), "country"],
        [fn("COUNT", col("enrolcourse.id")), "enrollmentCount"],
      ],
      include: [
        {
          model: User,
          attributes: [],
          as: "user",
        },
      ],
      group: ["user.country"],
    });

    // total completed
    const totalCompleted = await EnrolCourse.count({
      include: [
        {
          model: Course,
          as: "course",
          where: {
            businessId,
          },
          include: [
            {
              model: CourseProgress,
              as: "courseProgress",
              attributes: ["progress"],
              where: {
                [Op.or]: [{ completed: true }, { progress: 100 }],
              },
            },
          ],
        },
      ],
    });

    res.status(200).json(
      JParser("ok-response", true, {
        totalRevenue,
        students,
        countries: countryStats,
        totalCompleted,
      })
    );
  } catch (error) {
    next(error);
  }
});

/*user courses*/
exports.user_courses = useAsync(async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const totalAmount = await Transactions.sum("amount", {
      where: {
        paidFor: "course",
      },
      include: [
        {
          model: Course,
          as: "course",
          attributes: [],
          where: {
            userId,
          },
        },
      ],
    });

    const totalRevenue = totalAmount || 0;

    const students = await EnrolCourse.count({
      include: [
        {
          model: Course,
          where: {
            userId,
          },
        },
      ],
    });

    const countryStats = await EnrolCourse.findAll({
      attributes: [
        [col("user.country"), "country"],
        [fn("COUNT", col("enrolcourse.id")), "enrollmentCount"],
      ],
      include: [
        {
          model: User,
          attributes: [],
          as: "user",
        },
      ],
      group: ["user.country"],
    });

    const totalCompleted = await EnrolCourse.count({
      include: [
        {
          model: Course,
          as: "course",
          where: {
            userId,
          },
          include: [
            {
              model: CourseProgress,
              as: "courseProgress",
              attributes: ["progress"],
              where: {
                [Op.or]: [{ completed: true }, { progress: 100 }],
                courseId: col("course.id"),
              },
            },
          ],
        },
      ],
    });

    // Send response
    res.status(200).json(
      JParser("ok-response", true, {
        totalRevenue,
        students,
        countries: countryStats,
        totalCompleted,
      })
    );
  } catch (error) {
    next(error);
  }
});

/* business course stats */
exports.business_course_stats = useAsync(async (req, res, next) => {
  try {
    console.log("Hi 2");
    // get the course id
    const { id: courseId } = req.params;
    let whereId = undefined;
    if (
      typeof req?.business?.id === "string" &&
      req.business.id.trim() !== ""
    ) {
      whereId = { businessId: req.business.id };
    } else if (typeof req?.user?.id === "string" && req.user.id.trim() !== "") {
      whereId = { userId: req.user.id };
    }

    // check the validity of the course
    const isCourse = await courseServices.findBy({
      id: courseId,
      ...whereId,
    });

    // check if the course exists
    if (!isCourse) {
      return res.status(404).json(JParser("course not found", false, null));
    }

    const totalAmount = await Transactions.sum("amount", {
      where: {
        paidFor: "course",
      },
      include: [
        {
          model: Course,
          as: "course",
          attributes: [],
          where: {
            id: courseId,
            ...whereId,
          },
        },
      ],
    });

    const totalRevenue = totalAmount || 0;

    const students = await EnrolCourse.count({
      include: [
        {
          model: Course,
          where: {
            id: courseId,
          },
        },
      ],
    });

    const countryStats = await EnrolCourse.findAll({
      attributes: [
        [col("user.country"), "country"],
        [fn("COUNT", col("enrolcourse.id")), "enrollmentCount"],
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: [],
        },
        {
          model: Course,
          attributes: [],
          where: {
            id: courseId,
          },
        },
      ],
      group: ["user.country"],
    });

    const totalCompleted = await CourseProgress.count({
      where: {
        progress: 100,
        courseId: courseId,
      },
      include: [
        {
          model: Course,
          as: "course",
          where: {
            id: courseId,
          },
        },
      ],
    });

    // Send response
    res.status(200).json(
      JParser("ok-response", true, {
        totalRevenue,
        students,
        countries: countryStats,
        totalCompleted,
      })
    );
  } catch (error) {
    next(error);
  }
});

/* user course stats*/
exports.user_courses_stats = useAsync(async (req, res, next) => {
  try {
    // get the course id
    const { id: courseId } = req.params;
    const { id: userId } = req.user;

    // check the validity of the course
    const isCourse = await courseServices.findBy({
      id: courseId,
    });

    // check if the course exists
    if (!isCourse) {
      return res.status(404).json(JParser("course not found", false, null));
    }

    const totalAmount = await Transactions.sum("amount", {
      where: {
        paidFor: "course",
      },
      include: [
        {
          model: Course,
          as: "course",
          attributes: [],
          where: {
            userId,
            id: courseId,
          },
        },
      ],
    });

    const totalRevenue = totalAmount || 0;

    const students = await EnrolCourse.count({
      include: [
        {
          model: Course,
          where: {
            id: courseId,
          },
        },
      ],
    });

    const countryStats = await EnrolCourse.findAll({
      attributes: [
        [col("user.country"), "country"],
        [fn("COUNT", col("enrolcourse.id")), "enrollmentCount"],
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: [],
        },
        {
          model: Course,
          attributes: [],
          where: {
            id: courseId,
          },
        },
      ],
      group: ["user.country"],
    });

    const totalCompleted = await CourseProgress.count({
      where: {
        progress: 100,
        courseId: courseId,
      },
      include: [
        {
          model: Course,
          as: "course",
          where: {
            id: courseId,
          },
        },
      ],
    });

    // Send response
    res.status(200).json(
      JParser("ok-response", true, {
        totalRevenue,
        students,
        countries: countryStats,
        totalCompleted,
      })
    );
  } catch (error) {
    next(error);
  }
});

/* jobs stats */
exports.jobs_stats = useAsync(async (req, res, next) => {
  try {
    const totalJobs = await Jobs.count();
    const totalAmount = await Transactions.sum("amount", {
      where: {
        paidFor: "jobs",
      },
    });

    const totalRevenue = totalAmount || 0;

    const enrols = await JobEnrol.count();

    const countryStats = await JobEnrol.findAll({
      attributes: [
        [col("user.country"), "country"],
        [fn("COUNT", col("jobenrols.id")), "enrollmentCount"],
      ],
      include: [
        {
          model: User,
          attributes: [],
          as: "user",
        },
      ],
      group: ["user.country"],
    });

    // Send response
    res.status(200).json(
      JParser("ok-response", true, {
        jobs: totalJobs,
        totalRevenue,
        applicants: enrols,
        countries: countryStats,
      })
    );
  } catch (error) {
    next(error);
  }
});

/* single job stats */
exports.single_job_stats = useAsync(async (req, res, next) => {
  try {
    // check the job validity
    const { id } = req.params;

    const isJob = await jobServices.findOne(id);

    if (!isJob) {
      return res.status(400).json(JParser("job not found", false, null));
    }

    const enrols = await JobEnrol.count({
      where: {
        jobId: id,
      },
    });

    const countryStats = await JobEnrol.findAll({
      attributes: [
        [col("user.country"), "country"],
        [fn("COUNT", col("jobenrols.id")), "enrollmentCount"],
      ],
      include: [
        {
          model: User,
          attributes: [],
          as: "user",
        },
      ],
      group: ["user.country"],
    });

    // Send response
    res.status(200).json(
      JParser("ok-response", true, {
        applicants: enrols,
        countries: countryStats,
      })
    );
  } catch (error) {
    next(error);
  }
});

/* funding stats */
exports.funding_stats = useAsync(async (req, res, next) => {
  try {
    const totalFuding = await Funding.count();
    const totalAmount = await Transactions.sum("amount", {
      where: {
        paidFor: "funding",
      },
    });

    const totalRevenue = totalAmount || 0;

    const enrols = await FundingEnrol.count();

    const countryStats = await FundingEnrol.findAll({
      attributes: [
        [col("user.country"), "country"],
        [fn("COUNT", col("fundingenrols.id")), "enrollmentCount"],
      ],
      include: [
        {
          model: User,
          attributes: [],
          as: "user",
        },
      ],
      group: ["user.country"],
    });

    // Send response
    res.status(200).json(
      JParser("ok-response", true, {
        totalFunding: totalFuding,
        totalRevenue,
        applicants: enrols,
        countries: countryStats,
      })
    );
  } catch (error) {
    next(error);
  }
});

/* single funding stats*/
exports.single_funding_stats = useAsync(async (req, res, next) => {
  try {
    // check the job validity
    const { id } = req.params;

    const isFunding = await fundingServices.findOne(id);

    if (!isFunding) {
      return res.status(400).json(JParser("funding not found", false, null));
    }

    const enrols = await FundingEnrol.count({
      where: {
        fundingId: id,
      },
    });

    const countryStats = await FundingEnrol.findAll({
      attributes: [
        [col("user.country"), "country"],
        [fn("COUNT", col("fundingenrols.id")), "enrollmentCount"],
      ],
      include: [
        {
          model: User,
          attributes: [],
          as: "user",
        },
      ],
      group: ["user.country"],
    });

    // Send response
    res.status(200).json(
      JParser("ok-response", true, {
        applicants: enrols,
        countries: countryStats,
      })
    );
  } catch (error) {
    next(error);
  }
});

/* */
