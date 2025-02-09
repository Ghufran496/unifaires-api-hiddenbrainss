const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../../controllers/course/lecture.quiz.controller");

const {
  add_lecture_quiz,
  update_lecture_quiz,
} = require("../../middleware/validations/lecture.quiz.validation");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.get("/:id", get_by_id);

router.post(
  "/",
  authorize(["business", "admin"]),
  bodyParser,
  add_lecture_quiz,
  store
);

router.put(
  "/:id",
  authorize(["business", "admin"]),
  update_lecture_quiz,
  update
);

router.delete("/:id", authorize(["business", "admin"]), destroy);

module.exports = router;
