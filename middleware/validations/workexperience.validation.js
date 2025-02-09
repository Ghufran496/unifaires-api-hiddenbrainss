const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_experience = async (req, res, next) => {
  try {
    const schema = Joi.array().items(
      Joi.object({
        company: Joi.string().required(),
        position: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        description: Joi.string().required(),
        startDate: Joi.date().iso({ format: "YYYY-MM-DD" }).required(),
        endDate: Joi.date().iso({ format: "YYYY-MM-DD" }),
        currentWorkHere: Joi.boolean().required(),
        userId: Joi.string(),
        businessId: Joi.string(),
      })
    );

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_experience = async (req, res, next) => {
  const schema = Joi.object({
    company: Joi.string(),
    position: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    description: Joi.string(),
    startDate: Joi.date().iso({ format: "YYYY-MM-DD" }).required(),
    endDate: Joi.date().iso({ format: "YYYY-MM-DD" }),
    currentWorkHere: Joi.boolean(),
  });

  utils.validate(schema)(req, res, next);
};
