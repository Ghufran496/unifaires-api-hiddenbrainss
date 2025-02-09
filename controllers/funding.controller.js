const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const fundingServices = require("../services/funding.services");
const fundingCategoryServices = require("../services/funding.category.services");
const { calculatePagination } = require("../helpers/paginate.helper");
const { USER_ROLES } = require("../helpers/user.helper");
const sendGridServices = require("../services/sendgrid.services");
const usersServices = require("../services/users.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

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

exports.admin = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await fundingServices.adminAll(req, offset, limit);

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
    const { limit, offset, page } = calculatePagination(req);

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
    const { limit, offset, page } = calculatePagination(req);

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
    const { fundingId } = req.params;

    const isFunding = await fundingServices.findBy({ id: fundingId });

    if (!isFunding) {
      return res.status(404).json(JParser("funding not found", false, null));
    }

    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await fundingServices.getAllUserApplicants(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        applicants: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

exports.business_funding_applicants = useAsync(async (req, res, next) => {
  try {
    const { fundingId: id } = req.params;

    const isFunding = await fundingServices.findBy(id);

    if (!isFunding) {
      return res.status(404).json(JParser("funding not found", false, null));
    }

    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await fundingServices.getAllBusinessApplicants(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        applicants: rows,
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
    let roleName = "";
    if (
      typeof req?.user?.roleName === "string" &&
      req.user.roleName.trim() !== ""
    ) {
      roleName = req.user.roleName.toLowerCase().trim();
    } else if (
      typeof req?.business?.roleName === "string" &&
      req.business.roleName.trim() !== ""
    ) {
      roleName = req.business.roleName.toLowerCase().trim();
    }

    if (req?.user?.id) {
      req.body.userId = req.user.id;
    } else if (req?.business?.id) {
      req.body.businessId = req.business.id;
    }

    if (req.body.contact) {
      req.body.contact = JSON.stringify(req.body.contact);
    }

    // check the funding category
    const { fundingcategoryId } = req.body;

    const isCategory = await fundingCategoryServices.findBy({
      id: fundingcategoryId,
    });

    if (!isCategory) {
      return res.status(400).json(JParser("invalid category id", false, null));
    }

    if (roleName === USER_ROLES.contributor) {
      req.body.status = "pending";
    }

    const create = await fundingServices.store(req);

    if (create) {
      return res.status(200).send(JParser("ok-response", true, create));
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const funding = await fundingServices.findOne(id);

    if (funding) {
      return res.status(200).send(JParser("ok-response!", true, funding));
    } else {
      return res.status(404).send(JParser("does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_slug = useAsync(async (req, res, next) => {
  try {
    const { slug } = req.params;

    const funding = await fundingServices.findBy({ slug });

    if (funding) {
      return res.status(200).send(JParser("ok-response!", true, funding));
    } else {
      return res.status(404).send(JParser("does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.business_update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isFunding = await fundingServices.findOne(id);

    if (!isFunding) {
      return res.status(404).send(JParser("not found!", false, null));
    }

    if (req?.body?.contact) {
      delete req.body.contact;
    }

    if (req.body.fundingcategoryId) {
      const isCategory = await fundingCategoryServices.findBy({
        id: req.body.fundingcategoryId,
      });

      if (!isCategory) {
        return res
          .status(400)
          .json(JParser("invalid category passed", false, null));
      }
    }
    if (req?.body?.businessId) {
      delete req.body.businessId;
    }

    const update = await fundingServices.update(id, req);

    if (update) {
      const funding = await fundingServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, funding));
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

    const { id: userId } = req.user;

    if (!isFunding) {
      return res.status(404).send(JParser("funding not found!", false, null));
    }

    if (req.body.fundingcategoryId) {
      const isCategory = await fundingCategoryServices.findBy({
        id: req.body.fundingcategoryId,
      });

      if (!isCategory) {
        return res
          .status(400)
          .json(JParser("invalid category passed", false, null));
      }
    }

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

    const update = await fundingServices.update(id, req);

    if (update) {
      const funding = await fundingServices.findOne(id);
      if (isApproveItem) {
        const userObj = await usersServices.findBy({
          id: funding?.userId,
        });
        sendGridServices.sendApproveFundingEmail({
          fundingObj: funding?.dataValues,
          userObj: userObj?.dataValues,
        });
      }

      return res.status(200).json(JParser("ok-response", true, funding));
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
      // delete the funding
      const destroy = await fundingServices.destroy(id);

      if (destroy) {
        return res.status(204).json(JParser("ok-response", true, null));
      }
    } else {
      return res.status(404).send(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.funding_attributes_filter = useAsync(async (req, res, next) => {
  try {
    const find = await fundingServices.getAllDistinctAttributes();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});
