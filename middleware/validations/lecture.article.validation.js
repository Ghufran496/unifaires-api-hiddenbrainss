const Joi = require("joi");
const { utils } = require("../../core");

exports.add_lecture_article = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      article: Joi.string().required(),
      meta: Joi.string(),
      lectureId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_lecture_article = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string(),
      article: Joi.string(),
      meta: Joi.string(),
      lectureId: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
