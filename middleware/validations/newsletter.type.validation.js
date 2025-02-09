const Joi = require("joi");
const { utils } = require("../../core");

exports.add_newletter_type = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_newletter_type = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.filter_newletter_type_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
