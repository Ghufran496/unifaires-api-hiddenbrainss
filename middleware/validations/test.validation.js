const Joi = require("joi");
const { utils } = require("../../core");

exports.add_test = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      duration: Joi.number().required(),
      minimumScore: Joi.number().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_test = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      duration: Joi.number().required(),
      minimumScore: Joi.number().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
