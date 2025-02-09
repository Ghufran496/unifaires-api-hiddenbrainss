const { utils, useAsync } = require("../core");
const educationServices = require("../services/education.services");

const { JParser } = utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await educationServices.all();

    if (all) {
      return res
        .status(200)
        .json(JParser("education fetch successfully", true, all));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_education = useAsync(async (req, res, next) => {
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

    const education = await educationServices.findAllBy({
      [column]: value,
    });

    if (education) {
      return res
        .status(200)
        .json(JParser("education retrieved successfully", true, education));
    } else {
      return res.status(404).json(JParser("No education found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const create = await educationServices.store(req);

    if (create) {
      return res
        .status(200)
        .json(JParser("education added successfully", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await educationServices.findOne(id);

    if (find) {
      return res
        .status(200)
        .json(JParser("education fetch successfully", true, find));
    } else {
      return res
        .status(404)
        .json(JParser("education doest not exist", false, null));
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

    const find = await educationServices.findOne(id);

    if (find) {
      const update = await educationServices.update(id, req);

      if (update) {
        const find = await educationServices.findOne(id);

        return res
          .status(200)
          .json(JParser("education fetch successfully", true, find));
      }
    } else {
      return res
        .status(404)
        .json(JParser("education doest not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await educationServices.findOne(id);

    if (find) {
      const destroy = await educationServices.destroy(id);

      if (destroy) {
        return res
          .status(204)
          .json(JParser("education deleted successfully", true, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("education doest not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});
