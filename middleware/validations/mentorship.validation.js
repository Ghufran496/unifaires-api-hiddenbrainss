const Joi = require("joi");
const { utils } = require("../../core");

exports.add_mentorship = async (req, res, next) => {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    othernames: Joi.string().allow("").optional(),
    email: Joi.string().email().required(),
    currentJobTitle: Joi.string().allow("").optional(),
    currentOrganization: Joi.string().allow("").optional(),
    phonenumber: Joi.string().required(),
    country: Joi.string().required(),
    mediaUrl: Joi.string().uri().required(),
    skills: Joi.array().items(Joi.string().uuid()).required(),
    about: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_mentorship = async (req, res, next) => {
  const schema = Joi.object({
    firstname: Joi.string(),
    lastname: Joi.string(),
    othernames: Joi.string().allow("").optional(),
    email: Joi.string().email(),
    currentJobTitle: Joi.string().allow("").optional(),
    currentOrganization: Joi.string().allow("").optional(),
    phonenumber: Joi.string(),
    country: Joi.string(),
    mediaUrl: Joi.string().uri(),
    skills: Joi.array().items(Joi.string().uuid()),
    about: Joi.string(),
    status: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};

exports.bulk_delete_validation = async (req, res, next) => {
  const schema = Joi.object({
    ids: Joi.array().items(Joi.string().uuid()).required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.filter_mentorship_validation = async (req, res, next) => {
  const schema = Joi.object({
    firstname: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    lastname: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    othernames: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    email: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    currentJobTitle: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    currentOrganization: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    phonenumber: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    country: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),

    skills: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    about: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    limit: Joi.number(),
    offset: Joi.number(),
    page: Joi.number(),
    status: Joi.string(),
  });

  utils.validateQuery(schema)(req, res, next);
};
