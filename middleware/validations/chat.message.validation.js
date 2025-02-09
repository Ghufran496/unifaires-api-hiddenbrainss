const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_chat_messages = async (req, res, next) => {
  try {
    const schema = Joi.object({
      content: Joi.string().required(),
      contentType: Joi.string().required(),
      chatId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_chat_messages = async (req, res, next) => {
  const schema = Joi.object({
    content: Joi.string().required(),
    chatId: Joi.string().required(),
    contentType: Joi.string(),
  });

  utils.validate(schema)(req, res, next);
};
