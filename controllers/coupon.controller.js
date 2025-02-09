const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const couponServices = require("../services/coupon.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 20;
    const offset = req.query.page ? +req.query.page : 0;
    let { count, rows } = await couponServices.all({ offset, limit });

    if (rows) {
      return res.status(200).send(
        JParser("ok-response", true, {
          coupons: rows,
          current_page: offset + 1,
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

exports.store = useAsync(async (req, res, next) => {
  try {
    // check if coupon already exist
    const { code } = req.body;

    const isCoupon = await couponServices.findBy({ code });

    if (isCoupon) {
      return res.status(404).json(JParser("coupon already exist", false, null));
    }

    const create = await couponServices.store(req);

    if (create) {
      return res.status(200).json(JParser("ok-response", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await couponServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found!", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await couponServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found!", false, null));
    }

    const update = await couponServices.update(id, req);

    if (update) {
      const find = await couponServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await couponServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found!", false, null));
    }

    const destroy = await couponServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
