const { useAsync } = require("../core");
const { JParser } = require("../core").utils;

const businessServices = require("../services/business.services");
const courseBusinessPayoutServices = require("../services/business.course.payout.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await courseBusinessPayoutServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { businessId } = req.body;

    const isBusiness = await businessServices.findOne(businessId);

    if (!isBusiness) {
      return res
        .status(404)
        .json(JParser("business does not exist", false, null));
    }

    const find = await courseBusinessPayoutServices.findBy({ businessId });

    if (find) {
      return res
        .status(409)
        .json(
          JParser("payout setting already exist for this business", false, find)
        );
    }

    const create = await courseBusinessPayoutServices.store(req);

    if (create) {
      return res.status(201).json(JParser("ok-response", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await courseBusinessPayoutServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("payout not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await courseBusinessPayoutServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("payout not found", false, null));
    }

    const update = await courseBusinessPayoutServices.update(id, req);

    if (update) {
      const find = await courseBusinessPayoutServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await courseBusinessPayoutServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("payout not found", false, null));
    }

    const destroy = await courseBusinessPayoutServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
