const Joi = require("joi");
const { utils } = require("../../core");

exports.add_resource_content = async (req, res, next) => {
  try {
    const schema = Joi.object({
      lectureId: Joi.string().required(),
      mediaUri: Joi.string().required(),
      meta: Joi.array().items(Joi.object()),
      title: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_resource_content = async (req, res, next) => {
  try {
    const schema = Joi.object({
      lectureId: Joi.string().required(),
      mediaUri: Joi.string().required(),
      meta: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
