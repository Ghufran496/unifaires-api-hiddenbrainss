// services
const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const lectureArticleServices = require("../services/lecture.article.services");
const lectureServices = require("../services/course/lecture.services");
const lectureContentServices = require("../services/course/lecture.content.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await lectureArticleServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { lectureId } = req.body;

    const isLecture = await lectureServices.findOne(lectureId);

    if (!isLecture) {
      return res.status(404).json(JParser("invalid lecture", false, null));
    }

    // create lecture article

    // check lecture content on this lecture leave article

    const isContent = await lectureContentServices.findBy({ lectureId });

    if (isContent) {
      return res
        .status(409)
        .json(JParser("content already exist", false, null));
    }

    // check lecture article on this lecture leave article

    const isArticle = await lectureArticleServices.findBy({ lectureId });

    if (isArticle) {
      return res
        .status(409)
        .json(JParser("article already exist", false, null));
    }

    const create = await lectureArticleServices.store(req);

    return res.status(201).json(JParser("ok-response", true, create));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isArticle = await lectureArticleServices.findOne(id);

    if (!isArticle) {
      return res
        .status(404)
        .json(JParser("lecture article not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, isArticle));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isArticle = await lectureArticleServices.findOne(id);

    if (!isArticle) {
      return res
        .status(404)
        .json(JParser("lecture article not found", false, null));
    }

    const update = await lectureArticleServices.update(id, req);

    if (update) {
      const find = await lectureArticleServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isArticle = await lectureArticleServices.findOne(id);

    if (!isArticle) {
      return res
        .status(404)
        .json(JParser("lecture article not found", false, null));
    }

    const destroy = await lectureArticleServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
