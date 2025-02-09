const associatePricingServices = require("../services/associate.pricing.services");
const { useAsync } = require("../core");
const { JParser } = require("../core").utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await associatePricingServices.all();

    if (all) {
      return res
        .status(200)
        .json(JParser("pricing fetch successfully", true, all));
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

    const isTitle = await associatePricingServices.findBy({ title });

    if (!isTitle) {
      // create

      const create = await associatePricingServices.store(req);

      if (create) {
        return res
          .status(201)
          .json(JParser("associate pricing added successfully", true, create));
      }
    } else {
      return res
        .status(400)
        .json(JParser("pricing of same title already exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const price = await associatePricingServices.findOne(id);

    if (price) {
      return res
        .status(200)
        .json(JParser("pricing fetch successfully", true, price));
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

    const price = await associatePricingServices.findOne(id);

    if (price) {
      const update = await associatePricingServices.update(id, req);

      if (update) {
        const price = await associatePricingServices.findOne(id);

        return res
          .status(200)
          .json(JParser("pricing updated successfully", true, price));
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

    const price = await associatePricingServices.findOne(id);

    if (price) {
      const destroy = await associatePricingServices.destroy(id);

      if (destroy) {
        return res
          .status(204)
          .json(JParser("pricing deleted successfully", true, null));
      }
    } else {
      return res.status(404).json(JParser("pricing not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
