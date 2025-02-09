const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../../controllers/course/quiz.controller");

const {
  add_quiz,
  update_quiz,
} = require("../../middleware/validations/quiz.validation");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.get("/:id", get_by_id);

router.post(
  "/",
  bodyParser,
  authorize(["business", "admin", "user"]),
  add_quiz,
  store
);

router.put(
  "/:id",
  authorize(["business", "admin", "user"]),
  update_quiz,
  update
);

router.delete("/:id", authorize(["business", "admin", "user"]), destroy);

module.exports = router;
