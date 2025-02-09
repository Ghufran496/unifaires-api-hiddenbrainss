const Joi = require("joi");
const { utils } = require("../../core");

exports.add_team = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string(),
    });

    // lectureId	mediaUri	meta

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_team = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
    });

    // lectureId	mediaUri	meta

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
