const Joi = require("joi");
const { utils } = require("../../core");

exports.add_transaction = async (req, res, next) => {
  try {
    const schema = Joi.object({
      paymentId: Joi.string().required(),
      method: Joi.string().required(),
      amount: Joi.number().required(),
      cost: Joi.number().required(),
      status: Joi.string().required(),
      unitCost: Joi.number().required(),
      qty: Joi.number().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_transaction = async (req, res, next) => {
  try {
    const schema = Joi.object({
      paymentId: Joi.number(),
      method: Joi.string(),
      amount: Joi.number(),
      cost: Joi.number(),
      status: Joi.string(),
      unitCost: Joi.number(),
      qty: Joi.number(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
