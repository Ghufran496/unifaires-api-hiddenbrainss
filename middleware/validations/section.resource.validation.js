const Joi = require("joi");
const { utils } = require("../../core");

exports.add_resource = async (req, res, next) => {
  try {
    const schema = Joi.object({
      lectureId: Joi.string().required(),
      mediaUri: Joi.string().uri().required(),
      meta: Joi.string(),
    });

    // lectureId	mediaUri	meta

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_resource = async (req, res, next) => {
  try {
    const schema = Joi.object({
      lectureId: Joi.string().required(),
      mediaUri: Joi.string().uri().required(),
      meta: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
