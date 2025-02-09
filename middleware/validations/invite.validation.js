const Joi = require("joi").extend(require("@joi/date"));
const { utils } = require("../../core");

exports.add_invite = async (req, res, next) => {
  const schema = Joi.object({
    invites: Joi.array().items(
      Joi.object({
        email: Joi.string().email().required(),
        text: Joi.string().required(),
        invitedUserType: Joi.string().valid("user", "business").required(),
        roleIds: Joi.array().items(Joi.string().required()).required(),
        permissionIds: Joi.array().items(Joi.string()),
      })
    ),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_invite = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    text: Joi.string(),
    invitedUserType: Joi.string().valid("user", "business"),
    roleIds: Joi.array().items(Joi.string()),
    permissionIds: Joi.array().items(Joi.string()),
  });

  utils.validate(schema)(req, res, next);
};

exports.accept_invite_validation = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    token: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};

/*
  user and business invite pagination
*/

exports.invite_query_validate = async (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string(),
    limit: Joi.number(),
    page: Joi.number(),
    username: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    firstname: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    lastname: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    othername: Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .allow(""),
    country: Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .allow(""),
    email: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    gender: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    inviteStatus: Joi.string(),
  });

  utils.validateQuery(schema)(req, res, next);
};
