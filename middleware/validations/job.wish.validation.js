const Joi = require("joi");
const { utils } = require("../../core");

exports.add_job_wishlist = async (req, res, next) => {
  try {
    const schema = Joi.object({
      jobId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_job_wishlist = async (req, res, next) => {
  try {
    const schema = Joi.object({
      jobId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
