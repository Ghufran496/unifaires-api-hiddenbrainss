const subscriptionPlanServices = require("../services/subscription.plan.services");
const { useAsync } = require("../core");
const { JParser } = require("../core").utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const result = await subscriptionPlanServices.all();

    return res.status(200).json(JParser("ok-response", true, result));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // check if title already exist

    const { title } = req.body;

    const price = await subscriptionPlanServices.findBy({ title });

    if (price) {
      // create

      return res
        .status(400)
        .json(JParser("subscription of same title already exist", false, null));
    }

    if (req.body.meta) {
      req.body.meta = JSON.stringify(req.body.meta);
    }

    const result = await subscriptionPlanServices.store(req);

    return res.status(201).json(JParser("ok-reponse", true, result));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await subscriptionPlanServices.findOne(id);

    if (!result) {
      return res
        .status(404)
        .json(JParser("pricing does not exist ", false, null));
    }

    return res
      .status(200)
      .json(JParser("price fetch successfully", true, result));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await subscriptionPlanServices.findOne(id);

    if (result) {
      const update = await subscriptionPlanServices.update(id, req);

      if (update) {
        const result = await subscriptionPlanServices.findOne(id);

        return res
          .status(200)
          .json(JParser("updated successfully", true, result));
      }
    } else {
      return res
        .status(404)
        .json(JParser("pricing does not exist ", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await subscriptionPlanServices.findOne(id);

    if (result) {
      const destroy = await subscriptionPlanServices.destroy(id);

      if (destroy) {
        return res
          .status(204)
          .json(JParser("price deleted successfully", true, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("pricing does not exist ", false, null));
    }
  } catch (error) {
    next(error);
  }
});
