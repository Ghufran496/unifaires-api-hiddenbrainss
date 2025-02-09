const Joi = require("joi");
const { utils } = require("../../core");

exports.add_instructor = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      image: Joi.string().uri(),
      bio: Joi.string().required(),
      courseId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_instructor = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      image: Joi.string().uri(),
      bio: Joi.string().required(),
      courseId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.filter_instructor = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
      id: Joi.string().required(),
      bio: Joi.string(),
      courseId: Joi.string(),
    });

    utils.validateQuery(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
