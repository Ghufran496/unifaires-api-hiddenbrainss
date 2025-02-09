const Joi = require("joi");
const { utils } = require("../../core");

exports.add_pricing = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().required(),
      default: Joi.boolean(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_pricing = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      price: Joi.number(),
      default: Joi.boolean(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
