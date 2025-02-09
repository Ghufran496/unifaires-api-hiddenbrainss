const Joi = require("joi");
const { utils } = require("../../core");

exports.add_user_to_group_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      chatId: Joi.string().required(),
      userId: Joi.string(),
      businessId: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.make_user_group_admin_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      chatId: Joi.string().required(),
      userId: Joi.string(),
      businessId: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.remove_user_from_group_admin_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      chatId: Joi.string().required(),
      userId: Joi.string(),
      businessId: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.remove_user_from_group_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      chatId: Joi.string().required(),
      userId: Joi.string(),
      businessId: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.rename_group_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
