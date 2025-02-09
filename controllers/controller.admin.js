const { useAsync, utils, errorHandle } = require("./../core");
const {
  User,
  Course,
  JobEnrol,
  Jobs,
  EnrolCourse,
  Transactions,

  CoursesReviews,
  Earnings,
} = require("./../models");
const { JParser } = utils;

const courseServices = require("../services/course/course.services");
const userServices = require("../services/users.services");
const roleService = require("../services/role.service");
const businessServices = require("../services/business.services");
const { calculatePagination } = require("../helpers/paginate.helper");

exports.adminStats = useAsync(async (req, res, next) => {
  try {
    const courses = await Course.count();

    const jobs = await Jobs.count();

    const users = await User.count();

    const enrolCourses = await EnrolCourse.count();

    const enrolJobs = await JobEnrol.count();

    const transactions = await Transactions.count();

    const credits = await Transactions.sum("amount", {
      where: { status: true },
    });

    const debits = await Earnings.sum("totalAmount", {
      where: { isSent: true },
    });

    const pending = await Earnings.sum("totalAmount", {
      where: { isSent: false },
    });

    const data = {
      courses,
      jobs,
      users,
      enrolCourses,
      enrolJobs,
      transactions,
      credits,
      debits,
      pending,
    };

    return res.status(200).json(JParser("ok-response", true, data));
  } catch (e) {
    next(e);
  }
});

exports.courseStats = useAsync(async (req, res, next) => {
  try {
    const { id: courseId } = req.params;

    const find = await courseServices.findOne(courseId);

    if (!find) {
      return res.status(404).json(JParser("course not found ", false, null));
    }

    const revenue = await Transactions.sum("amount", {
      where: { courseId },
    });

    const students = await EnrolCourse.count({ where: { courseId } });

    const ratingValues = [1, 2, 3, 4, 5];

    const ratings = await Promise.all(
      ratingValues.map(async (ratingValue) => {
        return {
          rating: ratingValue,
          value: await CoursesReviews.count({
            where: { courseId, rating: ratingValue },
          }),
        };
      })
    );

    return res.status(200).json(
      JParser("ok-response", true, {
        revenue: revenue || 0,
        students,
        ratings,
      })
    );
  } catch (e) {
    next(e);
  }
});

// all course stats
exports.allCoursesStats = useAsync(async (req, res, next) => {
  try {
    const revenue = await Transactions.sum("amount", {
      where: {
        paidFor: "course",
      },
    });

    const students = await EnrolCourse.count();

    return res.status(200).json(
      JParser("ok-response", true, {
        revenue: revenue || 0,
        students,
      })
    );
  } catch (e) {
    next(e);
  }
});

// make user and admin

exports.change_user_role = useAsync(async (req, res, next) => {
  try {
    const { userId, role } = req.body;

    const user = await userServices.findOne(userId);

    if (!user) {
      return res.status(404).json(JParser("user not found ", false, null));
    }

    // get admin id

    const isRole = await roleService.findBy({ title: role });

    const update = await userServices.update(user.id, {
      body: {
        roleId: isRole.id,
      },
    });

    if (update) {
      const user = await userServices.findOne(userId);

      return res.status(200).json(JParser("ok-response", true, user));
    }
  } catch (e) {
    next(e);
  }
});

// list admin
exports.get_admin = useAsync(async (req, res, next) => {
  try {
    // get admin id

    const role = await roleService.findBy({ title: "admin" });

    const { limit, offset, page } = calculatePagination(req);

    const { count, rows } = await userServices.findAllByAdmin(
      req,
      {
        roleId: role.id,
      },
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        results: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (e) {
    next(e);
  }
});

// list user
exports.get_users = useAsync(async (req, res, next) => {
  try {
    // get admin id

    const role = await roleService.findBy({ title: "user" });

    const { limit, offset, page } = calculatePagination(req);

    const { count, rows } = await userServices.findAllByAdmin(
      req,
      {
        roleId: role.id,
      },
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        results: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (e) {
    next(e);
  }
});

// list business
exports.get_business = useAsync(async (req, res, next) => {
  try {
    // get admin id

    const role = await roleService.findBy({ title: "business" });

    const { limit, offset, page } = calculatePagination(req);

    const { count, rows } = await businessServices.findAllByAdmin(
      req,
      {
        roleId: role.id,
      },
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        results: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (e) {
    next(e);
  }
});

// deactivate user
exports.deactivate_user_account = useAsync(async (req, res, next) => {
  try {
    // get the user id

    const { userId } = req.body;

    const isUser = await userServices.findOne(userId);

    if (!isUser) {
      return res.status(404).json(JParser("user not found ", false, null));
    }

    // change the user status to false

    const update = await userServices.update(userId, {
      body: { status: false },
    });

    if (update) {
      const user = await userServices.findOne(userId);

      return res.status(200).json(JParser("ok-response", true, user));
    }
  } catch (e) {
    next(e);
  }
});

// deactivate busness
exports.deactivate_business_account = useAsync(async (req, res, next) => {
  try {
    // get the user id

    const { businessId } = req.body;

    const isBusiness = await businessServices.findOne(businessId);

    if (!isBusiness) {
      return res.status(404).json(JParser("business not found", false, null));
    }

    // change the user status to false

    const update = await businessServices.update(businessId, {
      body: {
        status: false,
      },
    });

    if (update) {
      const business = await businessServices.findOne(businessId);

      return res.status(200).json(JParser("ok-response", true, business));
    }
  } catch (e) {
    next(e);
  }
});

/*
  - activate account 
*/

// deactivate user
exports.activate_user_account = useAsync(async (req, res, next) => {
  try {
    // get the user id

    const { userId } = req.body;

    const isUser = await userServices.findOne(userId);

    if (!isUser) {
      return res.status(404).json(JParser("user not found ", false, null));
    }

    // change the user status to false
    const update = await userServices.update(userId, {
      body: { status: true },
    });

    if (update) {
      const user = await userServices.findOne(userId);

      return res.status(200).json(JParser("ok-response", true, user));
    }
  } catch (e) {
    next(e);
  }
});

// activate busness
exports.activate_business_account = useAsync(async (req, res, next) => {
  try {
    // get the user id

    const { businessId } = req.body;

    const isBusiness = await businessServices.findOne(businessId);

    if (!isBusiness) {
      return res.status(404).json(JParser("business not found ", false, null));
    }

    // change the user status to false
    const update = await businessServices.update(businessId, {
      body: { status: true },
    });

    if (update) {
      const business = await businessServices.findOne(businessId);

      return res.status(200).json(JParser("ok-response", true, business));
    }
  } catch (e) {
    next(e);
  }
});
