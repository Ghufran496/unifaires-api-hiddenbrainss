const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_profession = async (req, res, next) => {
  try {
    const schema = Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        year: Joi.string().required(),
        userId: Joi.string(),
        businessId: Joi.string(),
      })
    );

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_profession = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    year: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};
