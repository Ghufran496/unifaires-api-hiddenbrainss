const Joi = require("joi");
const { utils } = require("../../core");

exports.add_teammembers = async (req, res, next) => {
  try {
    const schema = Joi.object({
      userId: Joi.string().required(),
      teamId: Joi.string().required(),
      role: Joi.string().required(),
    });

    // lectureId	mediaUri	meta

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_teammembers = async (req, res, next) => {
  try {
    const schema = Joi.object({
      userId: Joi.string(),
      teamId: Joi.string(),
      role: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
