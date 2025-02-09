const Joi = require("joi");
const { utils } = require("../../core");

exports.add_section = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      courseId: Joi.string().required(),
      objective: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_section = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      objective: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
