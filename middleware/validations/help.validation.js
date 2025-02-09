const Joi = require("joi");
const { utils } = require("../../core");

exports.add_help = async (req, res, next) => {
  try {
    const schema = Joi.object({
      services: Joi.string(),
      category: Joi.string(),
      severity: Joi.string().required(),
      subject: Joi.string().required(),
      description: Joi.string().required(),
      file: Joi.string().uri(),
      language: Joi.string(),
      email: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_help = async (req, res, next) => {
  try {
    const schema = Joi.object({
      services: Joi.string(),
      category: Joi.string(),
      severity: Joi.string(),
      subject: Joi.string(),
      description: Joi.string(),
      file: Joi.string().uri(),
      language: Joi.string(),
      email: Joi.string().email(),
      status: Joi.string().valid("pending", "assigned", "resolved", "disputed"),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.help_by_status = async (req, res, next) => {
  try {
    const schema = Joi.object({
      status: Joi.string().valid("pending", "assigned", "resolved", "disputed"),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.filter_help_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      services: Joi.string(),
      category: Joi.string(),
      severity: Joi.string(),
      subject: Joi.string(),
      description: Joi.string(),
      language: Joi.string(),
      email: Joi.string(),
      days: Joi.string(),
      status: Joi.string().valid("pending", "assigned", "resolved", "disputed"),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
