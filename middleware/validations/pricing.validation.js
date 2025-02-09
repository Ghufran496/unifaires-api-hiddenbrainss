const Joi = require("joi");
const { utils } = require("../../core");

exports.add_pricing = async (req, res, next) => {
  try {
    const schema = Joi.object({
      type: Joi.string().valid("free", "paid").required(),
      currency: Joi.string().when("type", {
        is: "paid",
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      amount: Joi.number().required(),
      discount: Joi.number().required(),
      courseId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_pricing = async (req, res, next) => {
  try {
    const schema = Joi.object({
      type: Joi.string().valid("free", "paid"),
      currency: Joi.string(),
      price: Joi.number(),
      discount: Joi.number(),
      courseId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
