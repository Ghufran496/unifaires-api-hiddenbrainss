const Joi = require("joi");
const { utils } = require("../../core");

exports.add_course_announcement = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      text: Joi.string().required(),
      meta: Joi.string(),
      courseId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_course_announcement = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string(),
      text: Joi.string(),
      meta: Joi.string(),
      courseId: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
