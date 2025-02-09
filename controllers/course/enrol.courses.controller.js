const enrolCourseServices = require("../../services/course/enrol.courses.services");
const courseServices = require("../../services/course/course.services");

const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");

const paymentServices = require("../../services/payment.services");

const transactionServices = require("../../services/transactions.services");
const { calculatePagination } = require("../../helpers/paginate.helper");
const associateUserServices = require("../../services/associate.user.services");
const taxServices = require("../../services/tax.services");
const { REFUNDABLE_DAYS } = require("../../data");

exports.index = useAsync(async (req, res, next) => {
  try {
    const enrolCourse = await enrolCourseServices.all();

    return res.status(200).json(JParser("ok-response", true, enrolCourse));
  } catch (error) {
    next(error);
  }
});

exports.get_course_enrol_students = useAsync(async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // validate course id

    const isCourse = await courseServices.findOne(courseId);

    if (!isCourse) {
      return res.status(404).json(JParser("course not found", false, null));
    }

    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await enrolCourseServices.findAllStudent(
      courseId,
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        students: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { courseIds, country } = req.body;

    const { id: userId, email, firstname, lastname } = req.user;

    const fullname = firstname + lastname;

    // Check if the courses exist and get pricing information
    const courses = await courseServices.coursePrices(courseIds);

    const validCourses = courses.filter((course) => course.pricing !== null);

    const enrollments = await Promise.all(
      validCourses.map(async (course) => {
        const { id: courseId, pricing } = course;

        const isUserEnrolled = await enrolCourseServices.findBy({
          userId,
          courseId,
          status: true,
        });

        if (isUserEnrolled) {
          return {
            courseId,
            success: false,
            message: "User is already enrolled in this course",
            enrollment: isUserEnrolled,
          };
        }

        /*
          check if the user is associate to the owner of this course

          if yes enrol without check for the course free or paid
        */

        let isAssociate = false;

        if (course.userId && course.isAssociateFree) {
          isAssociate = true;
        } else if (course.businessId && course.isAssociateFree) {
          isAssociate = (await associateUserServices.findOneBy({
            associateId: userId,
            businessId: course.businessId,
          }))
            ? true
            : false;
        }

        if (isAssociate) {
          // enrol the user on the course and return

          req.body.userId = userId;
          req.body.courseId = courseId;
          req.body.paymentPlatform = "free";
          req.body.paymentId = "free";

          return {
            courseId,
            success: true,
            message: "Course enrollment successful (Associate)",
            enrollment: await enrolCourseServices.store(req),
          };
        } else {
          if (pricing.type === "free") {
            // Enroll user into the free course
            req.body.userId = userId;
            req.body.courseId = courseId;
            req.body.paymentPlatform = "free";
            req.body.paymentId = "free";

            return {
              courseId,
              success: true,
              message: "Course enrollment successful (Free)",
              enrollment: await enrolCourseServices.store(req),
            };
          } else {
            // Charge customer for the paid course
            const customer = await paymentServices.getOrCreateCustomer(
              email,
              fullname
            );
            const { amount: pricingAmount, currency, discount } = pricing;

            const discountedAmount = (+pricingAmount * discount) / 100;

            const amount = (+pricingAmount - discountedAmount) * 100;

            // check for  country tax
            const tax = await taxServices.findBy({
              country,
            });

            let finalAmount = amount;

            if (tax) {
              const { vat } = tax;

              finalAmount = finalAmount + (vat * finalAmount) / 100;
            }
            const chargeData = {
              amount: finalAmount,
              currency,
              customer: customer.id,
              description: "course payment",
              metadata: { userId },
            };

            const charge_customer = await paymentServices.chargeStripeCustomer(
              chargeData
            );

            if (!charge_customer.paid) {
              return {
                courseId,
                success: false,
                message: "Payment failed",
                enrollment: null,
              };
            }

            // check if refundable days is more than 0

            await transactionServices.store({
              body: {
                paymentId: charge_customer.id,
                paidFor: "course",
                paidForId: courseId,
                method: "stripe",
                amount: finalAmount / 100,
                courseId,
                cost: pricingAmount,
                status: true,
                userId,
                isRefundable: REFUNDABLE_DAYS > 0 ? true : false,
              },
            });

            // Enroll user into the paid course
            req.body.userId = userId;
            req.body.courseId = courseId;
            req.body.paymentPlatform = "stripe";
            req.body.paymentId = charge_customer.id;

            // store the transactions

            return {
              courseId,
              success: true,
              message: "Payment and course enrollment successful",
              enrollment: await enrolCourseServices.store(req),
            };
          }
        }
      })
    );

    return res.status(201).json(JParser("ok-response", true, enrollments));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const { id: userId } = req.user;

    const enrol = await enrolCourseServices.getSingleUserEnrol(id, userId);

    if (!enrol) {
      return res.status(404).json(JParser("not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, enrol));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isEnrol = await enrolCourseServices.findOne(id);

    if (isEnrol) {
      const update = await enrolCourseServices.update(id, req);

      if (update) {
        const enrol = await enrolCourseServices.findOne(id);

        return res
          .status(200)
          .json(JParser("updated successfully", true, enrol));
      }
    } else {
      return res
        .status(404)
        .json(JParser("supply id does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isEnrol = await enrolCourseServices.findOne(id);

    if (!isEnrol) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await enrolCourseServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.my_course = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    let enrolCourses = { count: 0, rows: [] };

    if (req.user) {
      const { id: userId } = req.user;

      enrolCourses = await enrolCourseServices.getUserCourseByUserId(
        req,
        offset,
        limit,
        { userId }
      );
    } else if (req.business) {
      const { id: businessId } = req.business;
      enrolCourses = await enrolCourseServices.getUserCourseByUserId(
        req,
        offset,
        limit,
        { businessId }
      );
    }

    const { count, rows } = enrolCourses;

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json(
      JParser("ok-response", true, {
        enrolcourse: rows,
        currentPage: page,
        limit,
        count,
        totalPages,
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.get_my_course_instructors = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    let enrolCourses = { count: 0, rows: [] };

    if (req.user) {
      const { id: userId } = req.user;

      enrolCourses = await enrolCourseServices.getMyCourseInstructors(
        req,
        offset,
        limit,
        { userId }
      );
    } else if (req.business) {
      const { id: businessId } = req.business;
      enrolCourses = await enrolCourseServices.getMyCourseInstructors(
        req,
        offset,
        limit,
        { businessId }
      );
    }

    const { count, rows } = enrolCourses;

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json(
      JParser("ok-response", true, {
        enrolcourse: rows,
        currentPage: page,
        limit,
        count,
        totalPages,
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.get_my_course_progress = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    let enrolCourses = { count: 0, rows: [] };

    if (req.user) {
      const { id: userId } = req.user;

      enrolCourses = await enrolCourseServices.getMyCourseProgress(
        req,
        offset,
        limit,
        { userId }
      );
    } else if (req.business) {
      const { id: businessId } = req.business;
      enrolCourses = await enrolCourseServices.getMyCourseProgress(
        req,
        offset,
        limit,
        { businessId }
      );
    }

    const { count, rows } = enrolCourses;

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json(
      JParser("ok-response", true, {
        courses: rows,
        currentPage: page,
        limit,
        count: rows.length,
        totalPages,
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.my_course_categories = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);
    let enrolCourses = { count: 0, rows: [] };

    if (req.user) {
      const { id: userId } = req.user;
      enrolCourses = await enrolCourseServices.getUserEnrolCoursesCategories(
        req,
        offset,
        limit,
        { userId }
      );
    } else if (req.business) {
      const { id: businessId } = req.business;
      enrolCourses = await enrolCourseServices.getUserEnrolCoursesCategories(
        req,
        offset,
        limit,
        { businessId }
      );
    }

    const { count, categories } = enrolCourses;
    const totalPages = Math.ceil(count / limit);

    return res.status(200).json(
      JParser("ok-response", true, {
        categories,
        currentPage: page,
        limit,
        count,
        totalPages,
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.my_course_instructors = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);
    let enrolCourses = { count: 0, rows: [] };

    if (req.user) {
      const { id: userId } = req.user;
      enrolCourses = await enrolCourseServices.getUserEnrolCoursesInstructors(
        req,
        offset,
        limit,
        { userId }
      );
    } else if (req.business) {
      const { id: businessId } = req.business;
      enrolCourses = await enrolCourseServices.getUserEnrolCoursesInstructors(
        req,
        offset,
        limit,
        { businessId }
      );
    }

    const { count, instructors } = enrolCourses;
    const totalPages = Math.ceil(count / limit);

    return res.status(200).json(
      JParser("ok-response", true, {
        instructors,
        currentPage: page,
        limit,
        count,
        totalPages,
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.my_course_organization_name = useAsync(async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const enrolCourses = await enrolCourseServices.getMyCourseOrganizations({
      userId,
    });

    return res.status(200).json(JParser("ok-response", true, enrolCourses));
  } catch (error) {
    next(error);
  }
});
