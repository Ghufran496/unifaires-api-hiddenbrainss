const Joi = require("joi");
const { utils } = require("../../core");

exports.add_course_payment_type = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      currency: Joi.string().required(),
      months: Joi.number(),
      meta: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_course_payment_type = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      price: Joi.number(),
      currency: Joi.string(),
      months: Joi.number(),
      meta: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
