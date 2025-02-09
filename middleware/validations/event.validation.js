const Joi = require("joi");
const { utils } = require("../../core");

exports.add_event = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
      courseId: Joi.string(),
      frequencyDay: Joi.string()
        .valid("once", "daily", "monthly", "yearly")
        .required(),
      frequencyTime: Joi.number().required(),
      time: Joi.string().required(),
      reminder: Joi.number().required(),
      endDate: Joi.date().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_event = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string(),
    courseId: Joi.string(),
    frequencyDay: Joi.string()
      .valid("once", "daily", "monthly", "yearly")
      .required(),
    frequencyTime: Joi.number().required(),
    time: Joi.string().required(),
    reminder: Joi.number().required(),
    endDate: Joi.date().required(),
  });

  utils.validate(schema)(req, res, next);
};
