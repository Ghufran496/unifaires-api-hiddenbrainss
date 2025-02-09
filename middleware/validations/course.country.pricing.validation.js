const Joi = require("joi");
const { utils } = require("../../core");

exports.add_course_country_pricings = async (req, res, next) => {
  try {
    const schema = Joi.object({
      country: Joi.string().required(),
      countryISO: Joi.string().required(),
      discount: Joi.number().required(),
      description: Joi.string().allow(null).optional(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_course_country_pricings = async (req, res, next) => {
  const schema = Joi.object({
    country: Joi.string(),
    countryISO: Joi.string(),
    discount: Joi.number(),
    description: Joi.string().allow(null).optional(),
  }).min(1);

  utils.validate(schema)(req, res, next);
};
