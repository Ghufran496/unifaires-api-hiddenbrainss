const Joi = require("joi");
const { utils } = require("../../core");

exports.add_earnings = async (req, res, next) => {
  try {
    const schema = Joi.object({
      transactionId: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_earnings = async (req, res, next) => {
  const schema = Joi.object({
    transactionId: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};
