const Joi = require("joi");
const { utils, useAsync } = require("../../core");
const { JParser } = utils;
const jobEnrolServices = require("../../services/job.enrol.services");
const courseServices = require("../../services/course/course.services");
const { JobEnrol, EnrolCourse } = require("../../models");
const sequelize = require("sequelize");

exports.add_virtual_account = async (req, res, next) => {
  try {
    const schema = Joi.object({
      bvn: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_virtual_account = async (req, res, next) => {
  const schema = Joi.object({
    bvn: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};

exports.fetch_virtual_account = async (req, res, next) => {
  const schema = Joi.object({
    orderRef: Joi.string(),
  });

  utils.validateParams(schema)(req, res, next);
};

exports.validate_bill_validation = async (req, res, next) => {
  const schema = Joi.object({
    billerCode: Joi.string().required(),
    itemCode: Joi.string().required(),
    customer: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.add_enrolcourse = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseIds: Joi.array().items(Joi.string().required()).required(),
      cardNumber: Joi.string().required(),
      cvv: Joi.string().required(),
      expiryYear: Joi.string().required(),
      expiryMonth: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.authorize_course_card = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseIds: Joi.array().items(Joi.string().required()).required(),
      cardNumber: Joi.string().required(),
      cvv: Joi.string().required(),
      expiryYear: Joi.string().required(),
      expiryMonth: Joi.string().required(),
      authorization: Joi.object().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.authorize_course_card_otp = async (req, res, next) => {
  try {
    const schema = Joi.object({
      otp: Joi.string().required(),
      txRef: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

// validate the course
exports.filter_courses = useAsync(async (req, res, next) => {
  try {
    const { courseIds } = req.body;
    const { id: userId } = req.user;

    // Validate all the courses
    const courses = await Promise.all(
      courseIds.map((courseId) => courseServices.findOne(courseId))
    );

    if (courses.every((course) => course)) {
      const enrolledCourses = await EnrolCourse.findAll({
        where: {
          userId,
          courseId: { [sequelize.Op.in]: courseIds },
        },
      });

      const filteredCourseIds = courseIds.filter(
        (courseId) =>
          !enrolledCourses.some(
            (enrollment) => enrollment.courseId === courseId
          )
      );

      // If no courses are available for enrollment
      if (filteredCourseIds.length === 0) {
        return res.status(409).json({
          success: false,
          message: "You have already enrol on this courses",
        });
      }

      // Update req.body.courseIds with the filtered ones
      req.body.courseIds = filteredCourseIds;

      // Call next middleware with updated req.body.courseIds

      next();
    } else {
      // If any courseId is invalid, return 404
      return res
        .status(404)
        .json(JParser("One or more courses do not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

/*
  job posting 
*/

exports.add_job_posting_card_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      jobId: Joi.string().required(),
      cardNumber: Joi.string().required(),
      cvv: Joi.string().required(),
      expiryYear: Joi.string().required(),
      expiryMonth: Joi.string().required(),
      jobPaymentTypeId: Joi.string().required(),
      country: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_job_posting_authorize_card_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      jobId: Joi.string().required(),
      cardNumber: Joi.string().required(),
      cvv: Joi.string().required(),
      expiryYear: Joi.string().required(),
      expiryMonth: Joi.string().required(),
      jobPaymentTypeId: Joi.string().required(),
      country: Joi.string().required(),
      authorization: Joi.object().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

/*
  funding posting 
*/

exports.add_funding_posting_card_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      fundingId: Joi.string().required(),
      cardNumber: Joi.string().required(),
      cvv: Joi.string().required(),
      expiryYear: Joi.string().required(),
      expiryMonth: Joi.string().required(),
      fundingPaymentTypeId: Joi.string().required(),
      country: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_funding_posting_authorize_card_validation = async (
  req,
  res,
  next
) => {
  try {
    const schema = Joi.object({
      fundingId: Joi.string().required(),
      cardNumber: Joi.string().required(),
      cvv: Joi.string().required(),
      expiryYear: Joi.string().required(),
      expiryMonth: Joi.string().required(),
      fundingPaymentTypeId: Joi.string().required(),
      country: Joi.string().required(),
      authorization: Joi.object().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

/*
  invite posting - flutterwave
*/

exports.add_invite_posting_card_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      invites: Joi.array().items(
        Joi.object({
          email: Joi.string().email().required(),
          text: Joi.string().required(),
          invitedUserType: Joi.string().valid("user", "business").required(),
          roleIds: Joi.array()
            .items(Joi.string().guid({ version: "uuidv4" }).required())
            .required(),
          permissionIds: Joi.array().items(
            Joi.string().guid({ version: "uuidv4" })
          ),
        })
      ),
      cardNumber: Joi.string().required(),
      cvv: Joi.string().required(),
      expiryYear: Joi.string().required(),
      expiryMonth: Joi.string().required(),
      invitePaymentTypeId: Joi.string().required(),
      country: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_invite_posting_authorize_card_validation = async (
  req,
  res,
  next
) => {
  try {
    const schema = Joi.object({
      invites: Joi.array().items(
        Joi.object({
          email: Joi.string().email().required(),
          text: Joi.string().required(),
          invitedUserType: Joi.string().valid("user", "business").required(),
          roleIds: Joi.array()
            .items(Joi.string().guid({ version: "uuidv4" }).required())
            .required(),
          permissionIds: Joi.array().items(
            Joi.string().guid({ version: "uuidv4" })
          ),
        })
      ),
      cardNumber: Joi.string().required(),
      cvv: Joi.string().required(),
      expiryYear: Joi.string().required(),
      expiryMonth: Joi.string().required(),
      invitePaymentTypeId: Joi.string().required(),
      country: Joi.string().required(),
      authorization: Joi.object().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

/*
  course free posting for business
*/

exports.add_course_posting_card_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().required(),
      cardNumber: Joi.string().required(),
      cvv: Joi.string().required(),
      expiryYear: Joi.string().required(),
      expiryMonth: Joi.string().required(),
      coursePaymentTypeId: Joi.string().required(),
      country: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_course_posting_card_authorize_validation = async (
  req,
  res,
  next
) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().required(),
      cardNumber: Joi.string().required(),
      cvv: Joi.string().required(),
      expiryYear: Joi.string().required(),
      expiryMonth: Joi.string().required(),
      coursePaymentTypeId: Joi.string().required(),
      country: Joi.string().required(),
      authorization: Joi.object().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_course_posting_card_otp_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      otp: Joi.string().required(),
      txRef: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
