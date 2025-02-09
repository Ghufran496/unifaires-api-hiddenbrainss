const inviteBusinessPricingServices = require("../services/invite.business.pricing.services");

const { useAsync } = require("../core");
const businessServices = require("../services/business.services");
const { JParser } = require("../core").utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await inviteBusinessPricingServices.all();

    if (all) {
      return res.status(200).json(JParser("ok-response", true, all));
    } else {
      return res.status(404).json(JParser("pricing not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { businessId } = req.body;

    // check if this is a valida business

    const isBusiness = await businessServices.findOne(businessId);

    if (!isBusiness) {
      return res
        .status(400)
        .json(JParser("business does not exist", false, null));
    }
    const find = await inviteBusinessPricingServices.findBy({ businessId });

    if (!find) {
      // create

      const create = await inviteBusinessPricingServices.store(req);

      if (create) {
        return res.status(201).json(JParser("ok-response", true, create));
      }
    } else {
      return res
        .status(409)
        .json(JParser("pricing already exist", false, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await inviteBusinessPricingServices.findOne(id);

    if (find) {
      return res.status(200).json(JParser("ok-response", true, find));
    } else {
      return res.status(404).json(JParser("pricing not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const price = await inviteBusinessPricingServices.findOne(id);

    if (price) {
      const update = await inviteBusinessPricingServices.update(id, req);

      if (update) {
        const price = await inviteBusinessPricingServices.findOne(id);

        return res.status(200).json(JParser("ok-response", true, price));
      }
    } else {
      return res.status(404).json(JParser("pricing not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const price = await inviteBusinessPricingServices.findOne(id);

    if (price) {
      const destroy = await inviteBusinessPricingServices.destroy(id);

      if (destroy) {
        return res.status(204).json(JParser("ok-response", true, null));
      }
    } else {
      return res.status(404).json(JParser("pricing not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
