const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../../controllers/course/quiz.question.controller");

const {
  add_question,
  update_question,
} = require("../../middleware/validations/quiz.question.validation");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.get("/:id", get_by_id);

router.post(
  "/",
  bodyParser,
  authorize(["business", "admin"]),
  add_question,
  store
);

router.put("/:id", authorize(["business", "admin"]), update_question, update);

router.delete("/:id", authorize(["business", "admin"]), destroy);

module.exports = router;
