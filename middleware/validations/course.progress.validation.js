const Joi = require("joi").extend(require("@joi/date"));

const { utils } = require("../../core");

exports.add_progress = async (req, res, next) => {
  try {
    const schema = Joi.object({
      lectureId: Joi.string().allow(null),
      lectureContentId: Joi.string().allow(null),
      quizId: Joi.string().allow(null),
      sectionId: Joi.string().allow(null),
      progress: Joi.number().required(),
      lectureArticleId: Joi.string().allow(null),
    }).xor(
      "lectureId",
      "quizId",
      "sectionId",
      "lectureContentId",
      "lectureArticleId"
    );

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_progress = async (req, res, next) => {
  const schema = Joi.object({
    lectureId: Joi.string().allow(null),
    quizId: Joi.string().allow(null),
    sectionId: Joi.string().allow(null),
    lectureContentId: Joi.string().allow(null),
    lectureArticleId: Joi.string().allow(null),
    progress: Joi.number(),
  }).xor(
    "lectureId",
    "quizId",
    "sectionId",
    "lectureContentId",
    "lectureArticleId"
  );

  utils.validate(schema)(req, res, next);
};
