const contactServices = require("../services/contact.services");

const { utils, useAsync } = require("../core");

const { JParser } = utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await contactServices.all();

    if (all) {
      return res
        .status(200)
        .json(JParser("contact fetch successfully", true, all));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_contact = useAsync(async (req, res, next) => {
  try {
    let column;
    let value;

    if (req.user) {
      column = "userId";
      value = req.user.id;
    } else if (req.business) {
      column = "businessId";
      value = req.business.id;
    }

    const contact = await contactServices.findAllBy({ [column]: value });

    if (contact) {
      return res
        .status(200)
        .json(JParser("contact retrieved successfully", true, contact));
    } else {
      return res.status(404).json(JParser("No contact found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    let id, key;

    if (req.user) {
      id = req.user.id;
      key = "userId";
    } else if (req.business) {
      id = req.business.id;
      key = "businessId";
    }

    if (id) {
      req.body[key] = id;

      // check if contact already exists
      const isContact = await contactServices.findBy({ [key]: id });

      if (isContact) {
        return res
          .status(409)
          .json(JParser(`Contact already exists for this ${key}`, false, null));
      }

      const create = await contactServices.store(req);

      if (create) {
        return res
          .status(200)
          .json(
            JParser(`Contact added successfully for this ${key}`, true, create)
          );
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await contactServices.findOne(id);

    if (find) {
      return res
        .status(200)
        .json(JParser("contact fetch successfully", true, find));
    } else {
      return res
        .status(404)
        .json(JParser("contact doest not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business;
    }

    const find = await contactServices.findOne(id);

    if (find) {
      const update = await contactServices.update(id, req);

      if (update) {
        const find = await contactServices.findOne(id);

        return res
          .status(200)
          .json(JParser("contact fetch successfully", true, find));
      }
    } else {
      return res
        .status(404)
        .json(JParser("contact doest not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await contactServices.findOne(id);

    if (find) {
      const destroy = await contactServices.destroy(id);

      if (destroy) {
        return res
          .status(204)
          .json(JParser("contact deleted successfully", true, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("contact doest not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});
