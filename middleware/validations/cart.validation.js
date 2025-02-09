const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_cart = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_cart = async (req, res, next) => {
  const schema = Joi.object({
    courseId: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};
