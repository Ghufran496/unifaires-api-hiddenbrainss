const express = require("express");
const router = express();

const {
  index,
  createQuestion,
  updateQuestion,
  destroy,
  upvoteQuestion,
  answerQuestion,
  getByCourse,
  upvoteAnswer,
} = require("../../controllers/course/question.controller");

const {
  create_question,
  update_question,
  create_answer,
} = require("../../middleware/validations/course.question_answer");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

// router.get("/", authorize(["admin"]), index);

router.get("/:courseId", authorize(["user", "admin", "business"]), getByCourse);

router.post(
  "/",
  bodyParser,
  authorize(["user", "business", "admin"]),
  create_question,
  createQuestion
);
router.post(
  "/answer",
  bodyParser,
  authorize(["user", "business", "admin"]),
  answerQuestion
);

router.put(
  "/:id",
  authorize(["user", "business", "admin"]),
  update_question,
  updateQuestion
);

router.put(
  "/upvote/:id",
  authorize(["user", "business", "admin"]),
  upvoteQuestion
);

router.put(
  "/upvote-answer/:id",
  authorize(["user", "business", "admin"]),
  upvoteAnswer
);

// router.delete("/:id", authorize(["business", "admin"]), destroy);

module.exports = router;
