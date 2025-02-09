const Joi = require("joi");
const { utils } = require("../../core");

exports.add_help_chat = async (req, res, next) => {
  try {
    const schema = Joi.object({
      ticketId: Joi.string().required(),
      message: Joi.string().required(),
      email: Joi.string().email(),
      businessId: Joi.string().guid(),
      userId: Joi.string().guid(),
      agentId: Joi.string().guid(),
    }).xor("email", "businessId", "userId", "agentId");

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};
