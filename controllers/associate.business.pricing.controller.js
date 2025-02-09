const associateBusinessPricingServices = require("../services/associate.business.pricing.services");

const { useAsync } = require("../core");
const businessServices = require("../services/business.services");
const { JParser } = require("../core").utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await associateBusinessPricingServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
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
      return res.status(404).json(JParser("business not-found", false, null));
    }

    const find = await associateBusinessPricingServices.findBy({ businessId });

    if (find) {
      return res.status(409).json(JParser("already exist", false, find));
    }

    const create = await associateBusinessPricingServices.store(req);

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

    const find = await associateBusinessPricingServices.findOne(id);

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

    const price = await associateBusinessPricingServices.findOne(id);

    if (!price) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await associateBusinessPricingServices.update(id, req);

    if (update) {
      const price = await associateBusinessPricingServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, price));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const price = await associateBusinessPricingServices.findOne(id);

    if (!price) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await associateBusinessPricingServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
