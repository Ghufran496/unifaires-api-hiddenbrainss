const Joi = require("joi");
const { utils } = require("../../core");

exports.add_funding_wish = async (req, res, next) => {
  try {
    const schema = Joi.object({
      fundingId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_funding_wish = async (req, res, next) => {
  try {
    const schema = Joi.object({
      fundingId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
