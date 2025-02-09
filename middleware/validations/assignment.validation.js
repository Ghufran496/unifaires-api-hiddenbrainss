const Joi = require("joi");
const { utils } = require("../../core");

exports.add_assignment = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string(),
      estimatedDuration: Joi.number(),
      instructionText: Joi.string(),
      instructionUri: Joi.array().items(Joi.string().uri()),
      questions: Joi.array().items(Joi.string()),
      courseId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_assignment = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string(),
      estimatedDuration: Joi.number(),
      instructionText: Joi.string(),
      instructionUri: Joi.array().items(Joi.string().uri()),
      questions: Joi.array().items(Joi.string()),
      courseId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
