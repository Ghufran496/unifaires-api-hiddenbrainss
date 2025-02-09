const Joi = require("joi");
const { utils } = require("../../core");

exports.add_business = async (req, res, next) => {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    othername: Joi.string(),
    companyName: Joi.string().required(),
    title: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    country: Joi.string().required(),
    about: Joi.string(),
    businessType: Joi.string().required(),
    companySize: Joi.string().required(),
    password: Joi.string().required(),
    imageUrl: Joi.string().uri(),
    meta: Joi.string(),
    language: Joi.string(),
    accountNumber: Joi.string(),
    bankName: Joi.string(),
    establishmentDate: Joi.string(),
  });
  
  utils.validate(schema)(req, res, next);
};

exports.update_business = async (req, res, next) => {
  const schema = Joi.object({
    firstname: Joi.string(),
    lastname: Joi.string(),
    othername: Joi.string().allow(""),
    companyName: Joi.string(),
    about: Joi.string(),
    title: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    country: Joi.string(),
    businessType: Joi.string(),
    companySize: Joi.string(),
    imageUrl: Joi.string().uri(),
    meta: Joi.string(),
    language: Joi.string(),
    accountNumber: Joi.string(),
    bankName: Joi.string(),
    establishmentDate: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};

exports.update_business_username_validation = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
  });

  utils.validate(schema)(req, res, next);
};

exports.filter_business_validation = async (req, res, next) => {
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
    othername: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    companyName: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    title: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    email: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    phone: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    country: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    about: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    businessType: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    companySize: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    password: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    imageUrl: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    meta: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
    language: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    establishmentDate: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),

    accountNumber: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    bankName: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    limit: Joi.number(),
    offset: Joi.number(),
    page: Joi.number(),
  });

  utils.validateQuery(schema)(req, res, next);
};
