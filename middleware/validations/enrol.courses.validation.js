const Joi = require("joi");
const { utils } = require("../../core");

exports.add_enrolcourse = async (req, res, next) => {
  //   userId, courseId, paymentId, paymentPlatform

  try {
    const schema = Joi.object({
      courseIds: Joi.array().items(Joi.string().required()).required(),
      currency: Joi.string(),
      country: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_enrol_course = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().required(),
      currency: Joi.string(),
      country: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.filter_student_enrol = async (req, res, next) => {
  try {
    const schema = Joi.object({
      firstname: Joi.string(),
      lastname: Joi.string(),
      othername: Joi.string(),
      country: Joi.string(),
      email: Joi.string(),
      gender: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
