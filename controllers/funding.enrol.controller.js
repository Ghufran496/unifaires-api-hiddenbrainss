const fundingEnrolServices = require("../services/funding.enrol.services");
const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const fundingServices = require("../services/funding.services");
const { calculatePagination } = require("../helpers/paginate.helper");

exports.index = useAsync(async (req, res, next) => {
  try {
    // paginate the list of enrols

    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await fundingEnrolServices.all(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        enrols: rows,
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
    const { id: userId } = req.user;
    req.body.userId = userId;

    const { fundingId } = req.body;

    // check if funding exist

    const isFunding = await fundingServices.findOne(fundingId);

    // check if user already enrol for the funding
    const isEnrol = await fundingEnrolServices.findBy({
      fundingId,
      userId,
    });

    if (!isFunding) {
      return res
        .status(404)
        .json(JParser("funding does not exist", false, null));
    }

    if (req.body.meta) {
      req.body.meta = JSON.stringify(req.body.meta);
    }

    if (isEnrol) {
      return res
        .status(409)
        .json(
          JParser("you have already enrol for this funding", false, isEnrol)
        );
    }

    const create = await fundingEnrolServices.store(req);

    return res.status(201).json(JParser("ok-response", true, create));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const findOne = await fundingEnrolServices.findOne(id);

    if (findOne) {
      return res.status(200).json(JParser("ok-response", true, findOne));
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isEnrol = await fundingEnrolServices.findOne(id);

    if (isEnrol) {
      if (req.body.meta) {
        req.body.meta = JSON.stringify(req.body.meta);
      }
      const update = await fundingEnrolServices.update(id, req);

      if (update) {
        const isEnrol = await fundingEnrolServices.findOne(id);

        return res.status(200).json(JParser("ok-response", true, isEnrol));
      }
    } else {
      return res.status(404).json(JParser("invalid enrol id", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update_status = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isEnrol = await fundingEnrolServices.findOne(id);

    if (isEnrol) {
      req.body.userId = isEnrol.userId;
      const update = await fundingEnrolServices.update(id, req);

      if (update) {
        const isEnrol = await fundingEnrolServices.findOne(id);

        return res.status(200).json(JParser("ok-response", true, isEnrol));
      }
    } else {
      return res.status(404).json(JParser("invalid enrol id", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isEnrol = await fundingEnrolServices.findOne(id);

    if (isEnrol) {
      const destroy = await fundingEnrolServices.destroy(id);

      if (destroy) {
        return res.status(204).json(JParser("ok-response", true, null));
      }
    } else {
      return res.status(404).json(JParser("enrol not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_enrol_funding = useAsync(async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await fundingEnrolServices.findMyEnrolFunding(
      userId,
      offset,
      limit,
      req
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        enrols: rows,
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

// business funding
exports.business_funding_enrol = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    const { id: businessId } = req.business;

    let { count, rows } = await fundingEnrolServices.findUserFunding(
      businessId,
      offset,
      limit,
      req
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        enrols: rows,
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

// user funding
exports.user_funding_enrol = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    const { id: userId } = req.user;

    let { count, rows } = await fundingEnrolServices.findUserFunding(
      userId,
      offset,
      limit,
      req
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        enrols: rows,
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
