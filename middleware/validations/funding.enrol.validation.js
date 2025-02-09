const Joi = require("joi");
const { utils } = require("../../core");

exports.add_enrol = async (req, res, next) => {
  try {
    const schema = Joi.object({
      fundingId: Joi.string().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      telephoneAvailability: Joi.boolean().required(),
      unifairesProfileLink: Joi.string().allow(null, ""),
      coverLetter: Joi.string().allow(null, ""),
      phoneNumber: Joi.string().required(),
      meta: Joi.array().items(
        Joi.object({
          key: Joi.string().required(),
          value: Joi.any().required(),
        })
      ),
      email: Joi.string().email().required(),
      availabilityFrom: Joi.date().iso().allow(null),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_enrol = async (req, res, next) => {
  try {
    const schema = Joi.object({
      fundingId: Joi.string(),
      firstname: Joi.string(),
      lastname: Joi.string(),
      telephoneAvailability: Joi.boolean(),
      unifairesProfileLink: Joi.string().allow(null, ""),
      coverLetter: Joi.string().allow(null, ""),
      phoneNumber: Joi.string(),
      meta: Joi.string(),
      email: Joi.string().email(),
      availabilityFrom: Joi.date().iso().allow(null),
      fundingUserStatus: Joi.string().valid(
        "pending",
        "interviewing",
        "accepted",
        "rejected",
        "cancelled",
        "funded"
      ),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.filter_enrol = async (req, res, next) => {
  try {
    const schema = Joi.object({
      fundingId: Joi.string(),
      firstname: Joi.string(),
      lastname: Joi.string(),
      telephoneAvailability: Joi.boolean(),
      phoneNumber: Joi.string(),
      email: Joi.string(),
      availabilityFrom: Joi.date().iso().allow(null),
      fundingUserStatus: Joi.string().valid(
        "pending",
        "interviewing",
        "accepted",
        "rejected",
        "cancelled",
        "funded"
      ),
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

      aboutMe: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      personality: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
      experienceLevel: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ),
    });

    utils.validateQuery(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
