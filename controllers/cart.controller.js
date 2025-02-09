const cartServices = require("../services/cart.services");
const { utils, useAsync } = require("../core");
const { JParser } = utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await cartServices.all();

    return res.status(200).json(JParser("success", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const { courseId } = req.body;
    req.body.userId = userId;

    // check if course has already exist
    const isCart = await cartServices.findBy({ userId, courseId });

    if (!isCart) {
      const create = await cartServices.store(req);

      if (create) {
        return res
          .status(201)
          .json(JParser("cart created successfully", true, create));
      }
    } else {
      return res
        .status(409)
        .json(JParser("course already add to cart", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await cartServices.findOne(id);

    if (find) {
      return res
        .status(200)
        .json(JParser("cart fetch successfully", true, find));
    } else {
      return res.status(404).json(JParser("cart does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_cart = useAsync(async (req, res, next) => {
  try {

    const { id: userId } = req.user || req.business;

    const find = await cartServices.findAllBy({ userId });

    if (find) {
      return res
        .status(200)
        .json(JParser("cart fetch successfully", true, find));
    } else {
      return res.status(404).json(JParser("cart does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await cartServices.findOne(id);

    if (find) {
      // update it
      const update = await cartServices.update(id, req);

      if (update) {
        const find = await cartServices.findOne(id);
        return res
          .status(200)
          .json(JParser("cart updated successfully", true, find));
      }
    } else {
      return res.status(404).json(JParser("cart does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await cartServices.findOne(id);

    if (find) {
      const destroy = await cartServices.destroy(id);

      if (destroy)
        return res
          .status(204)
          .json(JParser("cart removed successfully", true, find));
    } else {
      return res.status(404).json(JParser("cart does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});
