const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_user_skill = async (req, res, next) => {
  try {
    const schema = Joi.object({
      skills: Joi.array().items(Joi.string().uuid()).required(),
    });
    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_user_skills = async (req, res, next) => {
  const schema = Joi.object({
    skills: Joi.array().items(Joi.string().uuid()),
  });

  utils.validate(schema)(req, res, next);
};
