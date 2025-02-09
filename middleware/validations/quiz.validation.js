const Joi = require("joi");
const { utils } = require("../../core");

exports.add_quiz = async (req, res, next) => {
  try {
    const schema = Joi.object({
      sectionId: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      duration: Joi.number(),
    });

    // lectureId	mediaUri	meta

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_quiz = async (req, res, next) => {
  try {
    const schema = Joi.object({
      sectionId: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      duration: Joi.number(),
    });

    // lectureId	mediaUri	meta

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
