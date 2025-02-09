const Joi = require("joi");
const { utils } = require("../../core");

exports.search_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
    });

    utils.validateQuery(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.search_name_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    utils.validateParams(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
