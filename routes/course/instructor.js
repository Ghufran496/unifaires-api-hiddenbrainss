const {
  add_instructor,
} = require("../../middleware/validations/instructor.validation");

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  course_instructor,
} = require("../../controllers/course/instructor.controller");

const express = require("express");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

const router = express();

router.get("/", authorize(["admin"]), index);

router.post(
  "/",
  bodyParser,
  authorize(["business", "admin"]),
  add_instructor,
  store
);

router.put("/:id", authorize(["business", "admin"]), update);

router.delete("/:id", authorize(["business", "admin"]), destroy);

router.get("/:id", get_by_id);

router.get(
  "/course/:courseId",
  authorize(["admin", "business"]),
  course_instructor
);

module.exports = router;
