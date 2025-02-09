const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const transactionServices = require("../services/transactions.services");
const courseServices = require("../services/course/course.services");
const jobServices = require("../services/jobs.services");
const usersServices = require("../services/users.services");
const planServices = require("../services/subscription.plan.services");
const paymentServices = require("../services/payment.services");
const { calculatePagination } = require("../helpers/paginate.helper");

exports.index = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

    const { rows, count } = await transactionServices.all(req, offset, limit);

    // paginations
    return res.status(200).send(
      JParser("ok-response", true, {
        transactions: rows,
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
    const { paidFor, paidForId } = req.body;

    // Define a map of payment types to their respective service functions
    const paymentServices = {
      course: courseServices,
      job: jobServices,
      // Add more payment types and corresponding services as needed
    };

    if (paidFor in paymentServices) {
      // Get the appropriate service based on the payment type
      const service = paymentServices[paidFor];

      const isPaymentValid = await service.findOne(paidForId);

      if (!isPaymentValid) {
        return res
          .status(400)
          .json(JParser(`Invalid ${paidFor} id`, false, null));
      } else {
        const create = await transactionServices.store(req);
        if (create) {
          return res
            .status(201)
            .json(JParser("Transaction successfully created", true, create));
        } else {
          return res
            .status(400)
            .json(JParser("Something went wrong", false, null));
        }
      }
    } else {
      return res
        .status(400)
        .json(JParser("unregistered payment request", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await transactionServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await transactionServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await transactionServices.update(id, req);

    if (update) {
      const find = await transactionServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await transactionServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await transactionServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.user = useAsync(async (req, res, next) => {
  try {
    // add paginations

    const { limit, offset, page } = calculatePagination(req);

    let idField = null;

    if (req.user) {
      idField = req.user.id;
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;

      idField = req.business.id;
    }

    if (idField) {
      const columnToUse = req.user ? "userId" : "businessId";

      const query = { [columnToUse]: idField };

      const { rows, count } = await transactionServices.findUserTransaction(
        req,
        offset,
        limit,
        query
      );

      return res.status(200).send(
        JParser("ok-response", true, {
          transactions: rows,
          currentPage: page,
          limit,
          count,
          pages: Math.ceil(count / limit),
        })
      );
    }
  } catch (error) {
    next(error);
  }
});

exports.subscription = useAsync(async (req, res, next) => {
  try {
    const subscription = await transactionServices.subscription();

    const subscriptions = await Promise.all(
      subscription.data.map(async (subscription) => {
        const { userId, planId } = subscription.metadata;

        const data = {};

        if (userId && planId) {
          const plan = await planServices.findOne(planId);

          const user = await usersServices.findOne(userId);
          if (plan && user) {
            data["plan"] = plan;
            data["user"] = user;
          }
        }
        return data;
      })
    );

    const result = subscriptions.filter(
      (entry) => Object.keys(entry).length > 0
    );
    return res.status(200).json(JParser("ok-response", true, result));
  } catch (error) {
    next(error);
  }
});

exports.charges = useAsync(async (req, res, next) => {
  try {
    const charges = await transactionServices.charges();

    if (charges) {
      const result = await Promise.all(
        charges.data.map(async (charge) => {
          const { userId, paidFor, courseId, jobId } = charge.metadata;
          const data = {};

          if (userId && (courseId || jobId) && paidFor) {
            if (paidFor === "course" && courseId) {
              const course = await courseServices.findOne(courseId);
              data["course"] = course ? course : "invalid course";
            } else if (paidFor === "jobs" && jobId) {
              const job = await jobServices.findOne(jobId);
              data["job"] = job ? job : "invalid job";
            }

            const user = await usersServices.findOne(userId);
            data["user"] = user ? user : "invalid user";
          }

          return data;
        })
      );

      return res.status(200).json(
        JParser("Transactions fetched successfully", true, {
          result,
        })
      );
    } else {
      return res
        .status(404)
        .json(JParser("No transactions on the system", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_subscription = useAsync(async (req, res, next) => {
  try {
    const { email } = req.user;

    const customerInfo = await paymentServices.getCustomerByEmail(email);

    if (customerInfo) {
      const { id: customerId } = customerInfo.data[0];

      const subscription = await transactionServices.user_subscription(
        customerId
      );

      if (subscription) {
        const subscriptions = await Promise.all(
          subscription.data.map(async (subscription) => {
            const { userId, planId } = subscription.metadata;

            const data = {};

            if (userId && planId) {
              const plan = await planServices.findOne(planId);

              if (plan) {
                data["plan"] = plan;
              }
            }
            return data;
          })
        );

        const result = subscriptions.filter(
          (entry) => Object.keys(entry).length > 0
        );
        return res
          .status(200)
          .json(JParser("transaction  fetch successfully", true, result));
      } else {
        return res
          .status(404)
          .json(JParser("No subscription  on the system", false, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("you have no transaction at the moment", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_charges = useAsync(async (req, res, next) => {
  try {
    // get the customer or create
    const isCustomer = await paymentServices.getCustomerByEmail(req.user.email);

    let customer_id = null;
    if (isCustomer && isCustomer.data.length > 0) {
      customer_id = isCustomer.data[0].id;

      // get the user charges

      const charges = await transactionServices.user_charges(customer_id);

      if (charges) {
        const result = await Promise.all(
          charges.data.map(async (charge) => {
            const { userId, paidFor, courseId, jobId } = charge.metadata;
            const data = {};

            if (userId && (courseId || jobId) && paidFor) {
              if (paidFor === "course" && courseId) {
                const course = await courseServices.findOne(courseId);
                data["course"] = course ? course : "invalid course";
              } else if (paidFor === "jobs" && jobId) {
                const job = await jobServices.findOne(jobId);
                data["job"] = job ? job : "invalid job";
              }
            }

            return data;
          })
        );

        return res.status(200).json(
          JParser("Transactions fetched successfully", true, {
            result,
          })
        );
      } else {
        return res
          .status(404)
          .json(JParser("No transactions on the system", false, null));
      }
    } else {
      return res.status(404).json(JParser("no transaction", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.paid_for_attributes_filter = useAsync(async (req, res, next) => {
  try {
    const find = await transactionServices.getAllPaidForAttributes();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});
