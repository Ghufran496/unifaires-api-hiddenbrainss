const Joi = require("joi");
const { utils } = require("../../core");

exports.add_newsletter_subscriber = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      newsletterTypeIds: Joi.array().items(Joi.string()),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_newsletter_subscriber = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      newsletterTypeIds: Joi.array().items(Joi.string()),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.filter_newsletter_subscribere_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
