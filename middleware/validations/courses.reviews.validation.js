const Joi = require("joi");
const { utils } = require("../../core");

exports.add_course_reviews = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().guid({ version: "uuidv4" }).required(),
      review: Joi.string(),
      rating: Joi.number().integer().min(1).max(5).allow(null),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_course_reviews = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().guid({ version: "uuidv4" }),
      review: Joi.string(),
      rating: Joi.number().integer().min(1).max(5).allow(null),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.filter_course_reviews = async (req, res, next) => {
  try {
    const schema = Joi.object({
      review: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
