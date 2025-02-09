const invitePricingServices = require("../services/invites.pricing.services");
const { useAsync } = require("../core");
const { JParser } = require("../core").utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await invitePricingServices.all();

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
    // check if pricing of same title already exist
    const { title } = req.body;

    const isTitle = await invitePricingServices.findBy({ title });

    if (!isTitle) {
      const create = await invitePricingServices.store(req);

      if (create) {
        return res.status(201).json(JParser("ok-response", true, create));
      }
    } else {
      return res
        .status(409)
        .json(JParser("pricing of same title already exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const price = await invitePricingServices.findOne(id);

    if (price) {
      return res.status(200).json(JParser("ok-response", true, price));
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

    const price = await invitePricingServices.findOne(id);

    if (price) {
      const update = await invitePricingServices.update(id, req);

      if (update) {
        const price = await invitePricingServices.findOne(id);

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

    const price = await invitePricingServices.findOne(id);

    if (price) {
      const destroy = await invitePricingServices.destroy(id);

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
