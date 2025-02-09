const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_social = async (req, res, next) => {
  try {
    const schema = Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          url: Joi.string().required(),
          userId: Joi.string(),
          businessId: Joi.string(),
        })
      )
      .required();

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_social = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string(),
    url: Joi.string(),
    userId: Joi.string(),
    businessId: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};
