const Joi = require("joi");
const { utils } = require("../../core");

exports.add_funding_business_pricings = async (req, res, next) => {
  try {
    const schema = Joi.object({
      businessId: Joi.string().required(),
      discount: Joi.number().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_funding_business_pricings = async (req, res, next) => {
  const schema = Joi.object({
    businessId: Joi.string(),
    discount: Joi.number(),
  }).min(1);

  utils.validate(schema)(req, res, next);
};
