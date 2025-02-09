const Joi = require("joi");
const { utils } = require("../../core");

exports.add_role = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    userLevel: Joi.string().valid("user", "business", "admin"),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_role = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    userLevel: Joi.string().valid("user", "business", "admin"),
  });

  utils.validate(schema)(req, res, next);
};

exports.get_role = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};
