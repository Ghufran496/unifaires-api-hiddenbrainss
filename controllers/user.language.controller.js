const { utils, useAsync } = require("../core");
const userLanguageServices = require("../services/user.language.services");

const { JParser } = utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await userLanguageServices.all();

    if (all) {
      return res
        .status(200)
        .json(JParser("user language fetch successfully", true, all));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_language = useAsync(async (req, res, next) => {
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

    const userLanguage = await userLanguageServices.findAllBy({
      [column]: value,
    });

    if (userLanguage) {
      return res
        .status(200)
        .json(
          JParser("user language retrieved successfully", true, userLanguage)
        );
    } else {
      return res
        .status(404)
        .json(JParser("No user language found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const create = await userLanguageServices.store(req);

    if (create) {
      return res
        .status(200)
        .json(JParser("user language added successfully", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await userLanguageServices.findOne(id);

    if (find) {
      return res
        .status(200)
        .json(JParser("user language fetch successfully", true, find));
    } else {
      return res
        .status(404)
        .json(JParser("user language doest not exist", false, null));
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

    const find = await userLanguageServices.findOne(id);

    if (find) {
      const update = await userLanguageServices.update(id, req);

      if (update) {
        const find = await userLanguageServices.findOne(id);

        return res
          .status(200)
          .json(JParser("user language fetch successfully", true, find));
      }
    } else {
      return res
        .status(404)
        .json(JParser("user language doest not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await userLanguageServices.findOne(id);

    if (find) {
      const destroy = await userLanguageServices.destroy(id);

      if (destroy) {
        return res
          .status(204)
          .json(JParser("user language deleted successfully", true, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("user language doest not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});
