const Joi = require("joi").extend(require("@joi/date"));
const { utils } = require("../../core");

exports.add_certificate = async (req, res, next) => {
  const schema = Joi.object({
    certificateType: Joi.string()
      .valid("recommendation", "certificate")
      .required(),
    image: Joi.string().uri().optional(),
    courseId: Joi.string().guid({ version: "uuidv4" }).required(),
    congratulationText: Joi.string().optional(),
    meta: Joi.object().optional(),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_certificate = async (req, res, next) => {
  const schema = Joi.object({
    certificateType: Joi.string()
      .valid("recommendation", "certificate")
      .optional(),
    image: Joi.string().uri().optional(),
    congratulationText: Joi.string().optional(),
    meta: Joi.object().optional(),
  });

  utils.validate(schema)(req, res, next);
};
