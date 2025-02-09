const inviteCountryPricingServices = require("../services/invite.country.pricing.services");

const { useAsync } = require("../core");
const { JParser } = require("../core").utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await inviteCountryPricingServices.all();

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
    const { country } = req.body;

    const find = await inviteCountryPricingServices.findBy({ country });

    if (!find) {
      // create

      const create = await inviteCountryPricingServices.store(req);

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

    const find = await inviteCountryPricingServices.findOne(id);

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

    const price = await inviteCountryPricingServices.findOne(id);

    if (price) {
      const update = await inviteCountryPricingServices.update(id, req);

      if (update) {
        const price = await inviteCountryPricingServices.findOne(id);

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

    const price = await inviteCountryPricingServices.findOne(id);

    if (price) {
      const destroy = await inviteCountryPricingServices.destroy(id);

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
