const Joi = require("joi");
const { utils } = require("../../core");

exports.email_auth_validation = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.login_validation = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),

    password: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.send_token = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.verify_token = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    token: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.reset_password = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    token: Joi.string().required(),
    password: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};
exports.verify_email = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    token: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};
exports.deactivate_account = async (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};
