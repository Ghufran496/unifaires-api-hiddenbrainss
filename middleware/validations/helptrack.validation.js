const Joi = require("joi");
const { utils } = require("../../core");

exports.add_helptrack = async (req, res, next) => {
  try {
    const schema = Joi.object({
      helpId: Joi.string().required(),

      assignToId: Joi.string().required(),
      meta: Joi.string(),
      status: Joi.string()
        .valid("pending", "assigned", "completed", "disputed")
        .required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_helptrack = async (req, res, next) => {
  try {
    const schema = Joi.object({
      services: Joi.string(),
      category: Joi.string(),
      severity: Joi.string(),
      subject: Joi.string(),
      description: Joi.string(),
      file: Joi.string().uri(),
      language: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_status = async (req, res, next) => {
  try {
    const schema = Joi.object({
      status: Joi.string()
        .valid("pending", "assigned", "resolved", "disputed")
        .required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
