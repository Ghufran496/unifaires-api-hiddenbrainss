const Joi = require("joi");
const { utils } = require("../../core");

exports.add_voucher = async (req, res, next) => {
  const schema = Joi.object({
    businessId: Joi.string().required(),
    voucher: Joi.string().required(),
    limit: Joi.number().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_voucher = async (req, res, next) => {
  const schema = Joi.object({
    businessId: Joi.string().required(),
    voucher: Joi.string().required(),
    limit: Joi.number().required(),
  });

  utils.validate(schema)(req, res, next);
};
