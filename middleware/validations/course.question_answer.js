const Joi = require("joi");
const { utils } = require("../../core");

exports.create_question = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().required(),
      title: Joi.string().required(),
      body: Joi.string().required(),
      category: Joi.string(),
      
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);

  }
};
exports.create_answer = async (req, res, next) => {
  try {
    const schema = Joi.object({
      questionId: Joi.string().required(),
      body: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);

  }
};

exports.update_question = async (req, res, next) => {
  try {

    const schema = Joi.object({
      title: Joi.string().required(),
      body: Joi.string().required(),
      category: Joi.string(),

    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
