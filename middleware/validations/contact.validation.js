const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_contact = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().required(),
      portfolioUrl: Joi.string().required(),
      isDefault: Joi.boolean().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_contact = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
    portfolioUrl: Joi.string(),
    isDefault: Joi.boolean(),
  });

  utils.validate(schema)(req, res, next);
};
