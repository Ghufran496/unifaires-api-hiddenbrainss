const Joi = require("joi");
const { utils } = require("../../core");

exports.add_general_course_payout = async (req, res, next) => {
  const schema = Joi.object({
    country: Joi.string().required(),
    businessPercentage: Joi.number().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_general_course_payout = async (req, res, next) => {
  const schema = Joi.object({
    country: Joi.string(),
    businessPercentage: Joi.number(),
  });

  utils.validate(schema)(req, res, next);
};
