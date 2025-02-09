const Joi = require("joi");
const { utils } = require("../../core");

exports.add_pricing = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string(),
      durationDays: Joi.number().required(),
      meta: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
        })
      ),
      price: Joi.number().required(),
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
      meta: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
        })
      ),
      price: Joi.number(),
      durationDays: Joi.number(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
