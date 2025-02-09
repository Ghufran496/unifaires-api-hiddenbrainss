const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_chat = async (req, res, next) => {
  try {
    const schema = Joi.object({
      receiverId: Joi.string().required(),
      receiverType: Joi.string().valid("user", "business").required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_group_chat = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      imageUrl: Joi.string(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_chat = async (req, res, next) => {
  const schema = Joi.object({
    receiverId: Joi.string().required(),
    receiver: Joi.string().valid("user", "business").required(),
  });

  utils.validate(schema)(req, res, next);
};
