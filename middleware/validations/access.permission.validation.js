const Joi = require("joi");
const { utils } = require("../../core");

exports.add_permission = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    meta: Joi.string(),
    userLevel: Joi.string().valid("user", "business", "admin"),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_permission = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    meta: Joi.string(),
    userLevel: Joi.string().valid("user", "business", "admin"),
  });

  utils.validate(schema)(req, res, next);
};
