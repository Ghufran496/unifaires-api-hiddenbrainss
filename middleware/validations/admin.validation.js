const Joi = require("joi");
const { utils } = require("../../core");

exports.change_user_role_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      userId: Joi.string().required(),
      role: Joi.string().valid("user", "admin").required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.deactivate_user_account_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      userId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.deactivate_business_account_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      businessId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
