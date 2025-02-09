const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");
const { calculatePagination } = require("../../helpers/paginate.helper");
const fundingServices = require("../../services/funding.services");
const jobCategoryServices = require("../../services/job.category.services");
const sendgridServices = require("../../services/sendgrid.services");
const usersServices = require("../../services/users.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await fundingServices.all(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        fundings: rows,
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

exports.admin_funding = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await fundingServices.getAllUserFunding(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        fundings: rows,
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

exports.business_funding = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await fundingServices.getAllBusinessFunding(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        fundings: rows,
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

// funding applicants
exports.admin_funding_applicants = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await fundingServices.getAllUserApplicants(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        fundings: rows,
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

exports.business_funding_applicants = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await fundingServices.getAllBusinessApplicants(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        fundings: rows,
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
    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;
    }

    if (req.body.contact) {
      req.body.contact = JSON.stringify(req.body.contact);
    }

    // check the funding category
    const { fundingcategoryId } = req.body;

    const isCategory = await jobCategoryServices.findOne(fundingcategoryId);

    if (!isCategory) {
      return res.status(400).json(JParser("invalid category id", false, null));
    }

    const create = await fundingServices.store(req);

    if (create) {
      return res.status(200).send(JParser("ok-response", true, create));
    } else {
      return res.status(400).send(JParser("something went wrong", true, []));
    }
  } catch (error) {
    next(error);
  }
});

exports.business_update = useAsync(async (req, res, next) => {
  try {
    // check if job exist
    const { id } = req.params;
    const isFunding = await fundingServices.findOne(id);

    req.body.businessId = req.business.id;

    if (isFunding) {
      if (req.body.contact) {
        req.body.contact = JSON.stringify(req.body.contact);
      }
      // update the job
      const update = await fundingServices.update(id, req);

      if (update) {
        // get the fundings again and send
        const job = await fundingServices.findOne(id);

        return res.status(200).json(JParser("ok-response", true, job));
      } else {
        return res.status(400).send("something went wrong", false, null);
      }
    } else {
      return res.status(404).send(JParser("not found!", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.admin_update = useAsync(async (req, res, next) => {
  try {
    let isApproveItem = false;
    const { id } = req.params;
    const isFunding = await fundingServices.findOne(id);

    if (isFunding) {
      if (
        typeof req?.body?.status === "string" &&
        req.body.status.toLowerCase().trim() === "approve"
      ) {
        req.body.status = "active";
        req.body.approveUserId = req?.user?.id;
        req.body.approvedAt = new Date();
        isApproveItem = true;
      }
      delete req.body.userId;
      delete req.body.contact;

      // update the job
      const update = await fundingServices.update(id, req);

      if (update) {
        const funding = await fundingServices.findOne(id);
        if (isApproveItem) {
          const userObj = await usersServices.findBy({
            id: funding?.userId,
          });
          sendgridServices.sendApproveFundingEmail({
            fundingObj: funding?.dataValues,
            userObj: userObj?.dataValues,
          });
        }

        return res.status(200).json(JParser("ok-response", true, funding));
      } else {
        return res.status(400).send("something went wrong", false, null);
      }
    } else {
      return res.status(404).send(JParser("not found!", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isFunding = await fundingServices.findOne(id);

    if (isFunding) {
      // update the job
      const deleted = await fundingServices.destroy(id);

      if (deleted) {
        return res.status(204).json(JParser("ok-response", true, null));
      }
    } else {
      return res.status(404).send(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
