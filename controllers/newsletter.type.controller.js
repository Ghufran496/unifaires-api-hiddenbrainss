const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const newsletterTypeServices = require("../services/newsletter.type.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await newsletterTypeServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // check if subscription type already exist

    const { name } = req.body;

    const isType = await newsletterTypeServices.findBy({ name });

    if (isType) {
      return res
        .status(409)
        .json(JParser("duplicate! newsletter type already exist", false, null));
    }

    const create = await newsletterTypeServices.store(req);

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

    const find = await newsletterTypeServices.findBy({ id });

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await newsletterTypeServices.findBy({ id });

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await newsletterTypeServices.update(id, req);

    if (update) {
      const find = await newsletterTypeServices.findBy({ id });

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await newsletterTypeServices.findBy({ id });

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    // destroy

    const destroy = await newsletterTypeServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
