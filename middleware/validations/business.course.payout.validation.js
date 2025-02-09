const Joi = require("joi");
const { utils } = require("../../core");

exports.add_business_course_payout = async (req, res, next) => {
  const schema = Joi.object({
    businessId: Joi.string().required(),
    businessPercentage: Joi.number(),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_business_course_payout = async (req, res, next) => {
  const schema = Joi.object({
    businessId: Joi.string().required(),
    businessPercentage: Joi.number(),
  });

  utils.validate(schema)(req, res, next);
};
