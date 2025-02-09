const Joi = require("joi");
const { utils } = require("../../core");

exports.add_language = async (req, res, next) => {
  try {
    const schema = Joi.object({
      language: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_langugage = async (req, res, next) => {
  try {
    const schema = Joi.object({
      language: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
