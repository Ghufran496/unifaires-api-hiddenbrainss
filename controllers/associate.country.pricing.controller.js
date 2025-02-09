const associateCountryPricingServices = require("../services/associate.country.pricing.services");

const { useAsync } = require("../core");
const { JParser } = require("../core").utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await associateCountryPricingServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { country } = req.body;

    const find = await associateCountryPricingServices.findBy({ country });

    if (find) {
      return res
        .status(409)
        .json(JParser("pricing already exist", false, find));
    }

    const create = await associateCountryPricingServices.store(req);

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

    const find = await associateCountryPricingServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("pricing not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const price = await associateCountryPricingServices.findOne(id);

    if (!price) {
      return res.status(404).json(JParser("pricing not found", false, null));
    }

    const update = await associateCountryPricingServices.update(id, req);

    if (update) {
      const price = await associateCountryPricingServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, price));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const price = await associateCountryPricingServices.findOne(id);

    if (!price) {
      return res.status(404).json(JParser("pricing not found", false, null));
    }

    const destroy = await associateCountryPricingServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
