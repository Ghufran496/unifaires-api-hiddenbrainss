const Joi = require("joi");
const { utils } = require("../../core");

exports.add_archieve = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_archieve = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      const validationErrors = error.details.map(
        (errorItem) => errorItem.message
      );

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
        data: null,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
