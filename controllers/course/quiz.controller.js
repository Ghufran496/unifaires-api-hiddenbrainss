const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");
const quizServices = require("../../services/course/quiz.services");
const sectionServices = require("../../services/course/section.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const quizzes = await quizServices.getAllQuiz();

    if (quizzes) {
      return res
        .status(200)
        .json(JParser("quizzes fetch successfully", true, quizzes));
    } else {
      return res
        .status(200)
        .json(JParser("no quiz available on the system", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // verify the section id

    const { sectionId } = req.body;

    const isSection = await sectionServices.getAllSectionById(sectionId);

    if (!isSection) {
      return res
        .status(404)
        .json(JParser("section does not exist", false, null));
    } else {
      const addQuiz = await quizServices.storeQuiz(req);

      if (addQuiz) {
        return res.status(201).json(JParser("quiz created", true, addQuiz));
      } else {
        return res
          .status(400)
          .json(JParser("something went wrong", false, null));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const quiz = await quizServices.getAllQuizById(id);

    if (quiz) {
      return res.status(200).json(JParser("quiz fetch", true, quiz));
    } else {
      return res.status(404).json(JParser("quiz not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isQuiz = await quizServices.getAllQuizById(id);

    if (isQuiz) {
      const updateQuiz = quizServices.updateQuiz(id, req);

      if (updateQuiz) {
        const quiz = await quizServices.getAllQuizById(id);
        return res.status(200).json(JParser("quiz updated", true, quiz));
      } else {
        return res
          .status(400)
          .json(JParser("something went wrong", false, null));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteQuiz = await quizServices.deleteQuiz(id);

    if (deleteQuiz) {
      return res.status(204).json(JParser("quiz deleted", true, null));
    } else {
      return res.status(404).json({
        status: false,
        message: "quiz not found",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
});
