const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_user_license = async (req, res, next) => {
  const schema = Joi.array()
    .items(
      Joi.object({
        licenseType: Joi.string().required(),
        licenseNumber: Joi.string(),
        expirationDate: Joi.date().iso({ format: "YYYY-MM-DD" }),
        userId: Joi.string(),
      })
    )
    .required();

  utils.validate(schema)(req, res, next);
};

exports.update_user_license = async (req, res, next) => {
  const schema = Joi.object({
    licenseType: Joi.string(),
    licenseNumber: Joi.string(),
    expirationDate: Joi.date().iso({ format: "YYYY-MM-DD" }),
    userId: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};
