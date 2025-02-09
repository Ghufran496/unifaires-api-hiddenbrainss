const Joi = require("joi");
const { utils } = require("../../core");

exports.add_user = async (req, res, next) => {
  try {
    const schema = Joi.object({
      transactionId: Joi.string().required(),
      fullname: Joi.string().required(),
      email: Joi.string().email().required(),
      startAt: Joi.date().required(),
      endAt: Joi.date().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_user = async (req, res, next) => {
  try {
    const schema = Joi.object({
      transactionId: Joi.string().required(),
      fullname: Joi.string(),
      email: Joi.string().email().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
