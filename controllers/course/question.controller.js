const { useAsync } = require("../../core");
const questionServices = require("../../services/course/question_answer.services");
const { getUserOrBusinessById } = require("../../helpers/user.helper"); // Import the utility function
const { JParser } = require("../../core/core.utils");
const courseServices = require("../../services/course/course.services");

// Create a new question - /course-qa/ ----- POST METHOD
// {
//   "courseId":"25e9caf0-7a91-4d32-b87e-64975a3c3505",
//   "title":"test 3 title",
//   "body":"asdf"
// }
// Update a question ---- /course-qa/:questionId ----- PUT METHOD
// {
//   "title":"test 3 title",
//   "body":"asdf",
//    "category":"Optional"
// }
// Upvote a question --- /course-qa/upvote/:questionId  --- PUT METHOD
// Upvote a question --- /course-qa/upvote-answer/:answerId  --- PUT METHOD

// Answer a question ---- /course-qa/answer ---- POST METHOD
//{
//   "body":"text of answer",
//    "questionId":"id of question",
//
// }
//get questions by course id ---- /course-qa/:courseId  GET METHOD

exports.index = useAsync(async (req, res) => {
  return res.status(201).json({ questions: [] });
});
// Create a new question
exports.createQuestion = useAsync(async (req, res, next) => {
  try {
    const { courseId } = req.body;

    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;
    }

    // validate the courseId
    const isCourse = await courseServices.findBy({ id: courseId });

    if (!isCourse) {
      return res.status(400).json(JParser("course not found", false, null));
    }

    // this is user
    const question = await questionServices.store(req);

    return res.status(201).json(JParser("ok-response", true, question));
  } catch (error) {
    next(error);
  }
});

// Update a question
exports.updateQuestion = useAsync(async (req, res) => {
  try {
    const { title, body } = req.body;
    const { id } = req.params;
    if (!id)
      return res.status(404).json({ error: "Please provide question id" });

    const question = await questionServices.findOne(id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    } else {
      question.title = title || question.title;
      question.body = body || question.body;

      await question.save();

      return res.status(200).json(question);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a question
exports.deleteQuestion = useAsync(async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findByPk(questionId);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    await question.destroy();

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Upvote a question
exports.upvoteQuestion = useAsync(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(404).json({ error: "Please provide question id" });

    const question = await questionServices.findOne(id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    } else {
      question.upvotes += 1;

      await question.save();

      return res.status(200).json(question);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Upvote a question
exports.upvoteAnswer = useAsync(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(404).json({ error: "Please provide question id" });

    const answer = await questionServices.findOneAnswer(id);

    if (!answer) {
      return res.status(404).json({ error: "Question not found" });
    } else {
      answer.upvotes += 1;

      await answer.save();

      return res.status(200).json(answer);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Answer a question
exports.answerQuestion = useAsync(async (req, res) => {
  try {
    const isUser = await getUserOrBusinessById(req);

    if (isUser) {
      if (req.user) {
        req.body.userId = req.user.id;
      } else if (req.business) {
        req.body.businessId = req.business.id;
      }
      const answer = await questionServices.storeAnswer(req);
      return res.status(201).json(answer);
    } else {
      return res.status(404).send(JParser("User does not exist", false, null));
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//get questions by course id
exports.getByCourse = useAsync(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    if (!courseId)
      return res.status(404).json({ error: "Please provide question id" });

    const questions = await questionServices.findAllInclude(courseId);
    if (questions) {
      return res.status(200).json(JParser("question fetched", true, questions));
    } else {
      return res.status(404).json(JParser("question not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
