const Joi = require("joi");
const { utils } = require("../../core");

exports.add_lecture_quiz = async (req, res, next) => {
  try {
    const schema = Joi.object({
      lectureId: Joi.string().required(),
      question: Joi.string().required(),
      type: Joi.string().valid("multiple", "truthy", "essay").required(),
      options: Joi.array()
        .items({
          answer: Joi.string().required(),
          correct: Joi.boolean().required(),
          why: Joi.string().required(),
        })
        .required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_lecture_quiz = async (req, res, next) => {
  try {
    const schema = Joi.object({
      lectureId: Joi.string().required(),
      question: Joi.string().required(),
      type: Joi.string().valid("multiple", "truthy", "essay"),
      options: Joi.array().items({
        answer: Joi.string().required(),
        correct: Joi.boolean().required(),
        why: Joi.string().required(),
      }),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
