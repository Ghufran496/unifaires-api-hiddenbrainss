const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_license = async (req, res, next) => {
  try {
    const schema = Joi.array().items(
      Joi.object({
        country: Joi.string().required(),
        licenseClass: Joi.string().required(),
        userId: Joi.string(),
        businessId: Joi.string(),
      })
    );

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_license = async (req, res, next) => {
  const schema = Joi.object({
    country: Joi.string(),
    licenseClass: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};
