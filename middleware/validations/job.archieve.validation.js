const Joi = require("joi");
const { utils } = require("../../core");

exports.add_archieve = async (req, res, next) => {
  try {
    const schema = Joi.object({
      jobId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_archieve = async (req, res, next) => {
  try {
    const schema = Joi.object({
      jobId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
