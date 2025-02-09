const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_address = async (req, res, next) => {
  try {
    const schema = Joi.object({
      fullname: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      state: Joi.string().required(),
      zipcode: Joi.string().required(),
      default: Joi.boolean(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_address = async (req, res, next) => {
  const schema = Joi.object({
    fullname: Joi.string(),
    phoneNumber: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    zipcode: Joi.string(),
    default: Joi.boolean(),
  });

  utils.validate(schema)(req, res, next);
};
