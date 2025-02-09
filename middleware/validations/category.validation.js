const Joi = require("joi");
const { utils } = require("../../core");

exports.add_category = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_subcategory = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      parentId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_category = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_bulk_category = async (req, res, next) => {
  try {
    const schema = Joi.object({
      categories: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
        })
      ),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.filter_category = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
      id: Joi.string(),
    });

    utils.validateQuery(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
