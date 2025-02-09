const Joi = require("joi");
const { utils } = require("../../core");

exports.add_subscription = async (req, res, next) => {
  try {
    const schema = Joi.object({
      cardId: Joi.string().required(),
      planId: Joi.string().required(),
      country: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_subscription = async (req, res, next) => {
  try {
    const schema = Joi.object({
      cardId: Joi.string(),
      planId: Joi.string(),
      country: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.unsubscribe_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      subscriptionId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
