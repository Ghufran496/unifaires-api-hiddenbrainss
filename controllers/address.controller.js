const { JParser } = require("../core/core.utils");
const addressServices = require("../services/address.services");
const userServices = require("../services/users.services");
const { useAsync, utils, errorHandle } = require("./../core");

exports.index = useAsync(async (req, res, next) => {
  try {
    const address = await addressServices.all();

    return res.status(200).json(JParser("ok-response", true, address));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    let address;
    let condition = {};

    if (req.user) {
      req.body.userId = req.user.id;
      condition = { userId: req.user.id };
    } else if (req.business) {
      req.body.businessId = req.business.id;
      condition = { businessId: req.business.id };
    }

    if (!req.body.default) {
      address = await addressServices.store(req);

      return res.status(201).json(JParser("ok-response", true, address));
    }

    const isDefault = await addressServices.findBy({
      ...condition,
      default: true,
    });

    if (isDefault) {
      await addressServices.removeUserDefault(condition);
    }

    address = await addressServices.store(req);

    return res.status(201).json(JParser("ok-response", true, address));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    let condition = {};

    if (req.user) {
      req.body.userId = req.user.id;
      condition = { userId: req.user.id };
    } else if (req.business) {
      req.body.businessId = req.business.id;
      condition = { businessId: req.business.id };
    }

    // validate user
    const find = await addressServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("invalid address id", false, null));
    }

    /* check  if their is default address and change it */
    const isDefault = await addressServices.findBy({
      ...condition,
      default: true,
    });

    if (isDefault) {
      // remove user default

      await addressServices.removeUserDefault(condition);
    }

    const update = await addressServices.update(id, req);

    if (update) {
      const find = await addressServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const id = req.params.id;

    // validate user
    const find = await addressServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("invalid address id", false, null));
    }

    const destroy = await addressServices.destroy(id);

    if (destroy)
      return res.status(204).json(JParser("ok-response", true, null));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const id = req.params.id;

    const address = await addressServices.findOne(id);

    if (!address) {
      return res.status(404).json(JParser("address not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, address));
  } catch (error) {
    next(error);
  }
});

exports.user_default_address = useAsync(async (req, res, next) => {
  let address = null;
  let idField = null;

  if (req.user) {
    idField = req.user.id;
  } else if (req.business) {
    idField = req.business.id;
  }

  if (idField) {
    const columnToUse = req.user ? "userId" : "businessId";

    const query = { [columnToUse]: idField };
    address = await addressServices.findAllBy(query);
  }

  if (!address) {
    return res.status(404).json(JParser("address id not found", false, null));
  }

  return res.status(200).json(JParser("ok-response", true, address));
});

exports.user_address = useAsync(async (req, res, next) => {
  let address = null;
  let idField = null;

  if (req.user) {
    idField = req.user.id;
  } else if (req.business) {
    idField = req.business.id;
  }

  if (idField) {
    const columnToUse = req.user ? "userId" : "businessId";

    const query = { [columnToUse]: idField };
    address = await addressServices.findAllBy(query);
  }

  if (!address) {
    return res.status(404).json(JParser("invalid address ", false, null));
  }

  return res.status(200).json(JParser("ok-response", true, address));
});
