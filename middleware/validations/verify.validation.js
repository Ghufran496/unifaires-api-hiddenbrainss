const Joi = require("joi");
const { utils } = require("../../core");

exports.add_token = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  utils.validate(schema)(req, res, next);
};
