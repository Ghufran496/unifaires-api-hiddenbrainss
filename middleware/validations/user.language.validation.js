const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_language = async (req, res, next) => {
  try {
    const schema = Joi.array().items(
      Joi.object({
        language: Joi.string().required(),
        proficiency: Joi.string().required(),
        userId: Joi.string(),
        businessId: Joi.string(),
      })
    );

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_language = async (req, res, next) => {
  const schema = Joi.object({
    language: Joi.string(),
    proficiency: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};
