const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const { REFUNDABLE_DAYS } = require("../data");
const { calculatePagination } = require("../helpers/paginate.helper");
const dayjs = require("dayjs");

const earningsServices = require("../services/earning.sevices");

exports.index = useAsync(async (req, res, next) => {
  try {
    // get all refunds in pagination

    const { limit, offset, page } = calculatePagination(req);

    const { rows, count } = await earningsServices.all(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        refunds: rows,
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
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await earningsServices.findOne(id);

    if (!find) {
      return res.status(400).json(JParser("refund not foudn", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.get_user_refunds = useAsync(async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await earningsServices.userRefund(
      req,
      offset,
      limit,
      userId
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        refunds: rows,
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

exports.update = useAsync(async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
