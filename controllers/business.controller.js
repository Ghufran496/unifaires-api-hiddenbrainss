const { JParser } = require("../core/core.utils");
const { calculatePagination } = require("../helpers/paginate.helper");
const {
  Course,
  Jobs,
  Transactions,
  EnrolCourse,
  Earnings,
} = require("../models");

const businessServices = require("../services/business.services");

const { useAsync } = require("./../core");

exports.index = useAsync(async (req, res, next) => {
  try {
    // filter busness
    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await businessServices.all(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        business: rows,
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
exports.stats = useAsync(async (req, res, next) => {
  try {
    const { id: businessId } = req.business;

    const jobs = await Jobs.count({ where: { businessId } });

    const transactions = await Transactions.count();

    const courseCount = await Course.count({ where: { businessId } });

    const students = await EnrolCourse.count({
      include: {
        model: Course,
        where: { businessId },
      },
    });

    async function calculateCourseRevenue() {
      // Find all courseIds owned by the specified businessId

      const getCourseIds = await Course.findAll({
        where: { businessId },
        attributes: ["id"],
      });

      const courseIds = getCourseIds.map((course) => course.id);

      const enrols = await EnrolCourse.findAll({
        where: { courseId: courseIds },
      });

      let i = 0;

      // Extract enrolCourseIds associated with the courseIds
      const enrolCourseIds = enrols.map((enrolCourse) => enrolCourse.id);

      // Calculate the total payment for all enrols
      const totalPayment = await Transactions.sum("amount", {
        where: {
          paidFor: "course",
          paidForId: enrolCourseIds,
        },
      });

      return totalPayment || 0;
    }

    const revenue = await calculateCourseRevenue();

    const debits = await Earnings.sum("totalAmount", {
      where: { isSent: true },
      include: [
        {
          model: Transactions,
          include: [
            {
              model: Course,
              where: { businessId },
              required: true,
              as: "course",
            },
          ],
        },
      ],
    });

    const pending = await Earnings.sum("totalAmount", {
      where: { isSent: false },
      include: [
        {
          model: Transactions,
          include: [
            {
              model: Course,
              where: { businessId },
              required: true,
              as: "course",
            },
          ],
        },
      ],
    });

    const data = {
      courses: courseCount,
      jobs,
      transactions,
      students,
      revenue,
      credits: revenue,
      debits,
      pending,
    };

    return res.status(200).json(JParser("ok-response", true, data));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const isBusiness = await businessServices.findBy({ email: req.body.email });

    if (isBusiness) {
      return res.status(400).json(JParser("email already exist", false, null));
    }

    // check if business of same name already exist
    const isBusinessName = await businessServices.findBy({
      companyName: req.body.companyName,
    });

    if (isBusinessName) {
      return res
        .status(409)
        .json(JParser("company name is taken", false, null));
    }

    // hash the password and create
    const create = await businessServices.registerBusiness(req);

    delete create.password;

    return res.status(201).json(JParser("ok-response", true, create));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const id = req.params.id;
    // check if business exist

    const isBusiness = await businessServices.findOne(id);

    if (!isBusiness) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await businessServices.update(id, req);

    if (update) {
      const business = await businessServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, business));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const id = req.params.id;

    // check resouces ownership

    const find = await businessServices.findOne(id);

    if (!find) {
      return res
        .status(404)
        .json(JParser("business does not exist", false, null));
    }

    const destroy = await businessServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const id = req.params.id;

    const business = await businessServices.findOne(id);

    if (!business) {
      return res.status(400).json(JParser("business not found", false, null));
    }

    return res
      .status(200)
      .json(JParser("business fetch successfully", true, business));
  } catch (error) {
    next(error);
  }
});

exports.my_profile = useAsync(async (req, res, next) => {
  try {
    const { id } = req.business;

    const business = await businessServices.findOne(id);

    if (!business) {
      return res.status(404).json(JParser("profile not found", false, null));
    }

    delete business.password;

    return res.status(200).json(JParser("ok-response", true, business));
  } catch (error) {
    next(error);
  }
});

exports.business_profile = useAsync(async (req, res, next) => {
  try {
    const { username } = req.params;

    const business = await businessServices.findBy({ username });

    if (!business) {
      return res.status(404).json(JParser("profile not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, business));
  } catch (error) {
    next(error);
  }
});

exports.update_business_username = useAsync(async (req, res, next) => {
  try {
    const { id } = req.business;

    const { username } = req.body;

    // check if username already exist
    const business = await businessServices.findOne(id);

    if (!business) {
      return res.status(404).json(JParser("profile not found", false, null));
    }

    const isUsername = await businessServices.findBy({ username });

    if (isUsername && isUsername.id != id) {
      return res.status(409).json(JParser("username is taken", false, null));
    }

    const update = await businessServices.update(business.id, {
      body: {
        username,
      },
    });

    if (update) {
      const business = await businessServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, business));
    }
  } catch (error) {
    next(error);
  }
});
