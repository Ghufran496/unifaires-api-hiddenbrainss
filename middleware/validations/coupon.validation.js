const Joi = require("joi");
const { utils } = require("../../core");

exports.add_coupons = async (req, res, next) => {
  const schema = Joi.object({
    code: Joi.string().required(),
    discount: Joi.number().required(),
    expirationDate: Joi.date().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_coupons = async (req, res, next) => {
  const schema = Joi.object({
    code: Joi.string(),
    discount: Joi.number(),
    expirationDate: Joi.date(),
  });

  utils.validate(schema)(req, res, next);
};
