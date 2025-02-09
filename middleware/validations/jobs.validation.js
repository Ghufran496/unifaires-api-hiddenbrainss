const Joi = require("joi");
const { utils } = require("../../core");

exports.add_jobs = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      referenceNo: Joi.string().required(),
      country: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipcode: Joi.string(),
      salary: Joi.number(),
      language: Joi.array().items(Joi.string()),
      organizationName: Joi.string().required(),
      aboutOrganization: Joi.string().required(),
      mediaUrl: Joi.string().uri(),
      details: Joi.string().required(),
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
      isUnifaires: Joi.boolean().required(),
      externalUrl: Joi.string().uri().allow(null, "").optional(),
      externalEmail: Joi.string().email().allow(null, "").optional(),
      jobcategoryId: Joi.string().required(),

      status: Joi.string()
        .valid(
          "opened",
          "archive",
          "deactivate",
          "interviewing",
          "hired",
          "closed"
        )
        .required(),
      type: Joi.string(),
      levelOfEducation: Joi.string(),
      experienceLevel: Joi.string(),
      employmentBenefits: Joi.array().items(Joi.string()),
      workingStyle: Joi.string().valid("Remote", "Onsite", "Hybrid").optional(),
      appDeadlineType: Joi.string().valid("Anytime", "Fixed").required(),
      deadlineEnd: Joi.date(),
      deadline: Joi.date(),
      skills: Joi.array().items(Joi.string().uuid()).required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_jobs = async (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid(
      "opened",
      "archive",
      "deactivate",
      "interviewing",
      "hired",
      "closed",
      "approve"
    ),
    jobcategoryId: Joi.string(),

    title: Joi.string(),
    referenceNo: Joi.string(),
    country: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipcode: Joi.string(),
    salary: Joi.number(),
    language: Joi.array().items(Joi.string()),
    organizationName: Joi.string(),
    aboutOrganization: Joi.string(),
    mediaUrl: Joi.string().uri(),
    details: Joi.string(),
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
    isUnifaires: Joi.boolean(),
    externalUrl: Joi.string().uri().allow(null, "").optional(),
    externalEmail: Joi.string().email().allow(null, "").optional(),
    type: Joi.string(),
    levelOfEducation: Joi.string(),
    experienceLevel: Joi.string(),
    employmentBenefits: Joi.array().items(Joi.string()),
    workingStyle: Joi.string().valid("Remote", "Onsite", "Hybrid").optional(),
    appDeadlineType: Joi.string().valid("Anytime", "Fixed").optional(),
    deadlineEnd: Joi.date(),
    deadline: Joi.date(),
    skills: Joi.array().items(Joi.string().uuid()),
  });

  utils.validate(schema)(req, res, next);
};

exports.filter_jobs = async (req, res, next) => {
  try {
    const schema = Joi.object({
      id: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
      businessId: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      userId: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      jobcategoryId: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      category: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),

      title: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      limit: Joi.number(),
      page: Joi.number(),
      referenceNo: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      country: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      city: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      state: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      zipcode: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      salary: Joi.number(),
      maxSalary: Joi.number(),
      minSalary: Joi.number(),
      language: Joi.alternatives().try(
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
      mediaUrl: Joi.string().uri(),
      details: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      isUnifaires: Joi.boolean(),
      status: Joi.string().valid(
        "opened",
        "archive",
        "deactivate",
        "interviewing",
        "hired",
        "closed",
        "pending"
      ),
      type: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      levelOfEducation: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      experienceLevel: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      // employmentBenefits: Joi.array().items(Joi.string()),
      employmentBenefits: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      workingStyle: Joi.string(),
      appDeadlineType: Joi.string(),

      appDeadlineType: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      deadline: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      skills: Joi.alternatives().try(
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
    });

    utils.validateQuery(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
