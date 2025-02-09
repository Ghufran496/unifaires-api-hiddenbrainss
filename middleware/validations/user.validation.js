const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_user = async (req, res, next) => {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    othername: Joi.string().allow(""),
    country: Joi.string().allow(""),
    email: Joi.string().email().required(),
    gender: Joi.string().required(),
    dateOfBirth: Joi.date().format("YYYY-MM-DD").utc(),
    password: Joi.string().required(),
    aboutMe: Joi.string(),
    personality: Joi.string(),
    experienceLevel: Joi.string(),
    estimatedYearlySalary: Joi.string(),
    currentProfessionalRole: Joi.string(),
    yearsOfExperience: Joi.number(),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_user = async (req, res, next) => {
  const schema = Joi.object({
    imageUrl: Joi.string().uri(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    othername: Joi.string().allow(""),
    gender: Joi.string(),
    dateOfBirth: Joi.string(),
    aboutMe: Joi.string(),
    personality: Joi.string(),
    estimatedYearlySalary: Joi.string(),
    currentProfessionalRole: Joi.string(),
    yearsOfExperience: Joi.number(),

    experienceLevel: Joi.string().allow(""),
    country: Joi.string().allow(""),
  });

  utils.validate(schema)(req, res, next);
};

exports.old_password_reset = async (req, res, next) => {
  const schema = Joi.object({
    oldPassword: Joi.string(),
    password: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};
exports.send_token = async (req, res, next) => {
  const schema = Joi.object({
    oldPassword: Joi.string(),
    password: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};

exports.associate_login = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().required(),
    password: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.associate_verify = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_username_validation = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.filter_user_validation = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    firstname: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    lastname: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    othername: Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .allow(""),
    country: Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .allow(""),
    email: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    gender: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    dateOfBirth: Joi.alternatives().try(
      Joi.array().items(Joi.date().format("YYYY-MM-DD").utc()),
      Joi.date().format("YYYY-MM-DD").utc()
    ),
    aboutMe: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    personality: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    estimatedYearlySalary: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    currentProfessionalRole: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    yearsOfExperience: Joi.alternatives().try(
      Joi.array().items(Joi.number()),
      Joi.number()
    ),
    experienceLevel: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    limit: Joi.number(),
    offset: Joi.number(),
    page: Joi.number(),
  });

  utils.validateQuery(schema)(req, res, next);
};
