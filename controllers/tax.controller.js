const taxServices = require("./../services/tax.services");
const { useAsync, utils } = require("./../core");
const { JParser } = utils;
exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await taxServices.all();

    return res.status(200).json(JParser("success", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // check if country already exist

    const { country } = req.body;

    // check if country already exist
    const isCountry = await taxServices.findBy({ country });

    if (!isCountry) {
      const store = await taxServices.store(req);

      if (store) {
        return res
          .status(201)
          .json(JParser("tax created successfully", true, store));
      }
    } else {
      return res
        .status(400)
        .json(
          JParser("country tax already exist, kindly use update", false, null)
        );
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await taxServices.findOne(id);

    if (find) {
      return res
        .status(200)
        .json(JParser("tax fetch successfully", true, find));
    } else {
      return res.status(400).json(JParser("tax does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await taxServices.findOne(id);

    if (find) {
      //  updates it
      const update = await taxServices.update(id, req);

      if (update) {
        const find = await taxServices.findOne(id);

        return res
          .status(200)
          .json(JParser(" tax updated successfully  ", true, find));
      }
    } else {
      return res.status(400).json(JParser("tax does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await taxServices.findOne(id);

    if (find) {
      const destroy = await taxServices.destroy(id);
      return res
        .status(204)
        .json(JParser("tax deleted successfully", true, null));
    } else {
      return res.status(400).json(JParser("tax does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});
