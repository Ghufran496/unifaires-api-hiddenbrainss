const Joi = require("joi");
const { utils } = require("../../core");

exports.add_funding = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      referenceNo: Joi.string().required(),
      size: Joi.number().required(),
      country: Joi.string().required(),
      state: Joi.string().required(),
      city: Joi.string().required(),
      zipcode: Joi.string().allow(null),
      language: Joi.string().allow(null),
      organizationName: Joi.string().required(),
      aboutOrganization: Joi.string().allow(null),
      mediaUrl: Joi.string().uri().required(),
      details: Joi.string().required(),
      isUnifaires: Joi.boolean().required(),
      contact: Joi.array().items({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        address1: Joi.string().required(),
        address2: Joi.string(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().required(),
        country: Joi.string().required(),
        email: Joi.string().email().required(),
        profileMediaUrl: Joi.string().uri(),
      }),
      externalUrl: Joi.string().uri().allow(null),
      type: Joi.string().allow(null),
      fundingPurpose: Joi.string(),
      deadline: Joi.date().allow(null),
      status: Joi.string()
        .valid(
          "active",
          "archive",
          "deactivate",
          "interviewing",
          "awarded",
          "closed",
          "pending"
        )
        .required(),
      fundingcategoryId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_funding = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    referenceNo: Joi.string(),
    size: Joi.number(),
    country: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    zipcode: Joi.string().allow(null),
    language: Joi.string().allow(null),
    organizationName: Joi.string(),
    aboutOrganization: Joi.string().allow(null),
    mediaUrl: Joi.string().uri(),
    details: Joi.string(),
    isUnifaires: Joi.boolean(),
    contact: Joi.array().items({
      firstname: Joi.string(),
      lastname: Joi.string(),
      address1: Joi.string(),
      address2: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipcode: Joi.string(),
      country: Joi.string(),
      email: Joi.string().email(),
      profileMediaUrl: Joi.string().uri(),
    }),
    externalUrl: Joi.string().uri().allow(null),
    type: Joi.string().allow(null),
    fundingPurpose: Joi.string(),
    deadline: Joi.date().allow(null),
    status: Joi.string().valid(
      "active",
      "archive",
      "deactivate",
      "interviewing",
      "awarded",
      "closed",
      "pending",
      "approve"
    ),
    fundingcategoryId: Joi.string(),
  }).min(1);

  utils.validate(schema)(req, res, next);
};

exports.filter_funding = async (req, res, next) => {
  try {
    const schema = Joi.object({
      businessId: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      userId: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      title: Joi.string(),
      referenceNo: Joi.string(),
      size: Joi.number(),
      country: Joi.string(),
      state: Joi.string(),
      city: Joi.string(),
      zipcode: Joi.string().allow(null),
      language: Joi.string().allow(null),
      organizationName: Joi.string(),
      aboutOrganization: Joi.string().allow(null),
      mediaUrl: Joi.string().uri(),
      details: Joi.string(),
      limit: Joi.number(),
      offset: Joi.number(),
      page: Joi.number(),
      isUnifaires: Joi.boolean(),
      contact: Joi.array().items({
        firstname: Joi.string(),
        lastname: Joi.string(),
        address1: Joi.string(),
        address2: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipcode: Joi.string(),
        country: Joi.string(),
        email: Joi.string().email(),
        profileMediaUrl: Joi.string().uri(),
      }),
      externalUrl: Joi.string().uri().allow(null),
      type: Joi.string().allow(null),
      fundingPurpose: Joi.string(),
      deadline: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      status: Joi.string().valid(
        "active",
        "archive",
        "deactivate",
        "interviewing",
        "awarded",
        "closed",
        "pending"
      ),
      fundingcategoryId: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
