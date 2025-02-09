const Joi = require("joi");
const { utils } = require("../../core");

exports.add_tax = async (req, res, next) => {
  try {
    const schema = Joi.object({
      country: Joi.string().required(),
      tax: Joi.number().required(),
      meta: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_tax = async (req, res, next) => {
  try {
    const schema = Joi.object({
      country: Joi.string(),
      tax: Joi.number().required(),
      meta: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
