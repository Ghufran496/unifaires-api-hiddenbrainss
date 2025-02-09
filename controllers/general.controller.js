const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const generalServices = require("../services/general.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const { title, page, limit } = req.query;

    const results = await generalServices.all(
      title,
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 10
    );
    return res.status(200).json(JParser("ok-response", true, results));
  } catch (error) {
    next(error);
  }
});

exports.search_name = useAsync(async (req, res, next) => {
  try {
    const { name } = req.params;

    const { page, limit } = req.query;

    const results = await generalServices.searchName(
      name,
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 10
    );

    return res.status(200).json(JParser("ok-response", true, results));
  } catch (error) {
    next(error);
  }
});

exports.search_name_chat = useAsync(async (req, res, next) => {
  try {
    const { name } = req.params;

    const { page, limit } = req.query;

    const results = await generalServices.searchNameChat(
      req,
      name,
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 10
    );

    return res.status(200).json(JParser("ok-response", true, results));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
