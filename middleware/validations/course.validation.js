const Joi = require("joi");
const { utils, useAsync } = require("../../core");

exports.add_course = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    video: Joi.string(),
    description: Joi.string().required(),
    organizationName: Joi.string().required(),
    aboutOrganization: Joi.string().required(),
    scope: Joi.string().required(),
    requirement: Joi.string().required(),
    categoryId: Joi.string().required(),
    target: Joi.string().required(),
    lang: Joi.string().required(),
    level: Joi.string().required(),
    skills: Joi.array().items(Joi.string().uuid()).required(),
    welcomeMessage: Joi.string().required(),
    congratulationMessage: Joi.string().required(),
    status: Joi.string().valid("active", "archive", "deactivate"),
    programRanking: Joi.string(),
    applicationDeadline: Joi.date(),
    levelsOfEducation: Joi.string(),
    qualificationType: Joi.string(),
    subtitleLanguage: Joi.string(),
    programStartDate: Joi.date(),
    applicationFees: Joi.number(),
    isAssociateFree: Joi.boolean(),
    programType: Joi.string(),
    studyPace: Joi.string(),
    studyMode: Joi.string(),
    isExternal: Joi.boolean(),
    externalUrl: Joi.string().when("isExternal", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string(),
    }),
    isScholarship: Joi.boolean(),
    scholarshipUrl: Joi.string().when("isScholarship", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string(),
    }),
  });

  schema.when("programRanking", {
    is: Joi.exist(),
    then: Joi.object({
      programRanking: Joi.string().required(),
      applicationDeadline: Joi.date().required(),
      levelsOfEducation: Joi.string().required(),
      qualificationType: Joi.string().required(),
      subtitleLanguage: Joi.string().required(),
      programStartDate: Joi.date().required(),
      applicationFees: Joi.number().required(),
      isAssociateFree: Joi.boolean().required(),
      programType: Joi.string().required(),
      studyPace: Joi.string().required(),
      studyMode: Joi.string().required(),
    }),
  });
  utils.validate(schema)(req, res, next);
};

exports.update_course = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    image: Joi.string(),
    video: Joi.string(),
    description: Joi.string(),
    organizationName: Joi.string(),
    aboutOrganization: Joi.string(),
    categoryId: Joi.string(),
    scope: Joi.string(),
    requirement: Joi.string(),
    target: Joi.string(),
    lang: Joi.string(),
    level: Joi.string(),
    skills: Joi.array().items(Joi.string().uuid()),
    welcomeMessage: Joi.string(),
    congratulationMessage: Joi.string(),
    status: Joi.string().valid(
      "active",
      "archive",
      "deactivate",
      "pending",
      "approve"
    ),
    programRanking: Joi.string(),
    applicationDeadline: Joi.date(),
    levelsOfEducation: Joi.string(),
    qualificationType: Joi.string(),
    subtitleLanguage: Joi.string(),
    programStartDate: Joi.date(),
    applicationFees: Joi.number(),
    isAssociateFree: Joi.boolean(),
    programType: Joi.string(),
    studyPace: Joi.string(),
    studyMode: Joi.string(),
    isExternal: Joi.boolean(),
    externalUrl: Joi.string().when("isExternal", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string(),
    }),
    isScholarship: Joi.boolean(),
    scholarshipUrl: Joi.string().when("isScholarship", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string(),
    }),
  });

  schema.when("programRanking", {
    is: Joi.exist(),
    then: Joi.object({
      programRanking: Joi.string().required(),
      applicationDeadline: Joi.date().required(),
      levelsOfEducation: Joi.string().required(),
      qualificationType: Joi.string().required(),
      subtitleLanguage: Joi.string().required(),
      programStartDate: Joi.date().required(),
      applicationFees: Joi.number().required(),
      isAssociateFree: Joi.boolean().required(),
      programType: Joi.string().required(),
      studyPace: Joi.string().required(),
      studyMode: Joi.string().required(),
    }),
  });

  utils.validate(schema)(req, res, next);
};

// filter
exports.filter_course = async (req, res, next) => {
  const schema = Joi.object({
    businessId: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    userId: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    title: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    slug: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
    description: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    organizationName: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    aboutOrganization: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    scope: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    requirement: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    target: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    lang: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
    level: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    pricing: Joi.string().valid("free", "paid"),
    skills: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    limit: Joi.number(),
    offset: Joi.number(),
    page: Joi.number(),
    status: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    programRanking: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    applicationDeadline: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    levelsOfEducation: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    qualificationType: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    subtitleLanguage: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    programStartDate: Joi.date(),
    applicationFees: Joi.number(),
    isAssociateFree: Joi.boolean(),
    programType: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    studyPace: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    studyMode: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    categoryId: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    category: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    averageRating: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    isExternal: Joi.boolean(),
    externalUrl: Joi.string().when("isExternal", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string().allow(""),
    }),
    isScholarship: Joi.boolean(),
    scholarshipUrl: Joi.string().when("isScholarship", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string(),
    }),
  });

  const { error } = schema.validate(req.query);

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

  // check course title exist for the user
  next();
};

/* course skills */
exports.skills_course_validation = async (req, res, next) => {
  const schema = Joi.object({
    skills: Joi.array().items(Joi.string().uuid()).required(),
  });

  utils.validate(schema)(req, res, next);
};
