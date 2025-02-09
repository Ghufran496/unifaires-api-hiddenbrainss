const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");
const lectureQuizServices = require("../../services/course/lecture.quiz.services");
const lectureServices = require("../../services/course/lecture.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const questions = await lectureQuizServices.all();

    if (questions) {
      return res.status(200).json(JParser("question fetch", true, questions));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { lectureId } = req.body;

    const isLecture = await lectureServices.findOne(lectureId);

    if (!isLecture)
      return res.status(404).json(JParser("invalid lecture", false, null));

    const create = await lectureQuizServices.store(req);

    if (create) {
      return res.status(201).json(JParser("question added", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check lecture

    const find = await lectureQuizServices.findOne(id);

    if (find) {
      return res.status(200).json(JParser("question fetch", true, find));
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const find = await lectureQuizServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("question not found", false, null));
    }

    const update = await lectureQuizServices.update(id, req);

    if (update) {
      const find = await lectureQuizServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    } else {
      return res.status(400).json(JParser("something went wrong"));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = lectureQuizServices.findOne(id);

    if (!find) {
      return res
        .status(404)
        .json(JParser("lecture quiz not found", false, null));
    }
    const destroy = await lectureQuizServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
