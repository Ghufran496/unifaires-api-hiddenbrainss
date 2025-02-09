const Joi = require("joi");
const { utils } = require("../../core");

exports.add_role_permission = async (req, res, next) => {
  const schema = Joi.object({
    roleId: Joi.string().required(),
    permissionId: Joi.string().required(),
    permisionId: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_role_permission = async (req, res, next) => {
  const schema = Joi.object({
    roleId: Joi.string(),
    permissionId: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};
