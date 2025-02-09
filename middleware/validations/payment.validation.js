const Joi = require("joi");

const { utils } = require("../../core");

exports.stripe_customer_by_email = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.stripe_customer_by_id = async (req, res, next) => {
  try {
    const schema = Joi.object({
      id: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_stripe_customer = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      description: Joi.string(),
      name: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.create_stripe_token = async (req, res, next) => {
  try {
    const schema = Joi.object({
      number: Joi.string().required(),
      exp_month: Joi.string().required(),
      exp_year: Joi.string().required(),
      cvc: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_stripe_token_to_customer = async (req, res, next) => {
  try {
    const schema = Joi.object({
      customer_id: Joi.string().required(),
      token_id: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.charge_stripe_customer_validation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      amount: Joi.number().required(),
      currency: Joi.string().required(),
      customer_id: Joi.string().required(),
      description: Joi.string().required(),
      metadata: Joi.object(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_stripe_card = async (req, res, next) => {
  try {
    const schema = Joi.object({
      exp_month: Joi.string()
        .regex(/^(0[1-9]|1[0-2])$/)
        .required()
        .label("Two-Digit Month"),
      exp_year: Joi.string()
        .regex(/^(?:\d{2}|\d{4})$/)
        .required()
        .label("Card Expiration Year"),
      number: Joi.string().required(),

      cvc: Joi.string()
        .regex(/^[0-9]{3,4}$/)
        .required()
        .label("Card Security Code"),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.remove_stripe_card = async (req, res, next) => {
  try {
    const schema = Joi.object({
      cardId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.charge_associate = async (req, res, next) => {
  try {
    const schema = Joi.object({
      card: Joi.object().required(),
      associates: Joi.array()
        .items(
          Joi.object({
            startDate: Joi.date(),
            endDate: Joi.date(),
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            email: Joi.string().email().required(),
          })
        )
        .required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_funding_stripe = async (req, res, next) => {
  try {
    const schema = Joi.object({
      fundingId: Joi.string().required(),
      fundingPaymentTypeId: Joi.string().required(),
      country: Joi.string().required(),
      currency: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_jobs_stripe = async (req, res, next) => {
  try {
    const schema = Joi.object({
      jobId: Joi.string().required(),
      jobPaymentTypeId: Joi.string().required(),
      country: Joi.string().required(),
      currency: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_invite_stripe = async (req, res, next) => {
  try {
    const schema = Joi.object({
      invites: Joi.array().items(
        Joi.object({
          email: Joi.string().email().required(),
          text: Joi.string().required(),
          invitedUserType: Joi.string().valid("user", "business").required(),
          roleIds: Joi.array()
            .items(Joi.string().guid({ version: "uuidv4" }).required())
            .required(),
          permissionIds: Joi.array().items(
            Joi.string().guid({ version: "uuidv4" })
          ),
        })
      ),

      invitePaymentTypeId: Joi.string().required(),
      country: Joi.string().required(),
      currency: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

// free business course posting

exports.add_free_business_course_validation_stripe = async (req, res, next) => {
  try {
    const schema = Joi.object({
      courseId: Joi.string().required(),
      coursePaymentTypeId: Joi.string().required(),
      country: Joi.string().required(),
      currency: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
