const Joi = require("joi");
const { utils } = require("../../core");

exports.add_transaction = async (req, res, next) => {
  try {
    const schema = Joi.object({
      paymentId: Joi.string().required(),
      userId: Joi.string().required(),
      paidFor: Joi.string().required(),
      paidForId: Joi.string().required(),
      method: Joi.string().required(),
      amount: Joi.number().required(),
      cost: Joi.number().required(),
      status: Joi.number().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_transaction = async (req, res, next) => {
  try {
    const schema = Joi.object({
      paymentId: Joi.string(),
      userId: Joi.string(),
      paidFor: Joi.string(),
      paidForId: Joi.string(),
      method: Joi.string(),
      amount: Joi.number(),
      cost: Joi.number(),
      status: Joi.number(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.filter_transaction = async (req, res, next) => {
  try {
    const schema = Joi.object({
      paymentId: Joi.string(),
      userId: Joi.string(),
      paidFor: Joi.string(),
      paidForId: Joi.string(),
      method: Joi.string(),
      amount: Joi.number(),
      cost: Joi.number(),
      status: Joi.number(),
      from: Joi.string(),
      to: Joi.string(),
      firstname: Joi.string(),
      lastname: Joi.string(),
      othername: Joi.string(),
      gender: Joi.string(),
      companyName: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
