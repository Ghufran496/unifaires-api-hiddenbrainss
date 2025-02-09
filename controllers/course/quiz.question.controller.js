const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");
const quizQuestionService = require("../../services/course/quiz.question.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const questions = await quizQuestionService.getAllQuizQuestion();

    if (questions) {
      return res.status(200).json(JParser("question fetch", true, questions));
    } else {
      return res
        .status(200)
        .json(JParser("no quesiton available", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const addQuestion = await quizQuestionService.storeQuizQuestion(req);

    if (addQuestion) {
      return res.status(201).json(JParser("question added", true, addQuestion));
    } else {
      return res.status(400).json(JParser("somethign went wrong"));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await quizQuestionService.getQuizQuestionById(id);

    if (question) {
      return res.status(200).json(JParser("question fetch", true, question));
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
    const question = await quizQuestionService.getQuizQuestionById(id);

    if (question) {
      const updateQuestion = await quizQuestionService.updateQuizQuestion(
        id,
        req
      );

      if (updateQuestion) {
        const question = await quizQuestionService.getQuizQuestionById(id);

        return res.status(200).json(JParser("updated", true, question));
      } else {
        return res.status(400).json(JParser("something went wrong"));
      }
    } else {
      return res
        .status(404)
        .json(JParser("question does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteQuestion = await quizQuestionService.deleteQuizQuestion(id);

    if (deleteQuestion) {
      return res.status(204).json(JParser("deleted", true, null));
    } else {
      return res.status(400).json(JParser("somethign went wrong", false, null));
    }
  } catch (error) {
    next(error);
  }
});
