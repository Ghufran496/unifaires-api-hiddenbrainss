const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");
const lectureContentServices = require("../../services/course/lecture.content.services");
const lectureServices = require("../../services/course/lecture.services");

const cloudinary = require("cloudinary");
const lectureArticleServices = require("../../services/lecture.article.services");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USERNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

exports.index = useAsync(async (req, res, next) => {
  try {
    const lectureContent = await lectureContentServices.all();

    return res.status(200).json(JParser("ok-response", true, lectureContent));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { mediaUri: public_id, lectureId } = req.body;

    // check if lecture is valid

    const isLecture = await lectureServices.findOne(lectureId);

    if (!isLecture) {
      return res.status(404).json(JParser("invalid lecture id", false, null));
    }

    // check if lecture already exist for this

    const isContent = await lectureContentServices.findBy({ lectureId });

    if (isContent) {
      return res.status(409).json(JParser("already exist", false, null));
    }

    // check if article exist restrict

    const isArticle = await lectureArticleServices.findBy({
      lectureId,
    });

    if (isArticle) {
      return res
        .status(409)
        .json(JParser("article already exist", false, null));
    }

    if (req.body.meta) {
      req.body.meta = JSON.stringify(req.body.meta);
    }

    const create = await lectureContentServices.store(req);

    if (create) {
      return res.status(201).json(JParser("ok-response", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const lectureContent = await lectureContentServices.findOne(id);

    if (!lectureContent) {
      return res.status(400).json(JParser("not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, lectureContent));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await lectureContentServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("lecture content does not exist"));
    }

    const update = await lectureContentServices.update(id, req);

    if (update) {
      const find = await lectureContentServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await lectureContentServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("lecture content does not exist"));
    }

    const destroy = await lectureContentServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
