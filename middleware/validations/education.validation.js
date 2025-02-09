const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_education = async (req, res, next) => {
  try {
    const schema = Joi.array().items(
      Joi.object({
        collegeName: Joi.string().required(),
        degree: Joi.string().required(),
        fromYear: Joi.string().required(),
        endYear: Joi.string().allow(null),
        userId: Joi.string(),
        businessId: Joi.string(),
        description: Joi.string(),
      })
    );

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_education = async (req, res, next) => {
  const schema = Joi.object({
    collegeName: Joi.string(),
    degree: Joi.string(),
    fromYear: Joi.string(),
    endYear: Joi.string().allow(null),
    description: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};
