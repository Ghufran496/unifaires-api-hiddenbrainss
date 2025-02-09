const Joi = require("joi");
const { utils } = require("../../core");

exports.add_course_wish = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().required(),
    });
    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_course_wish = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
