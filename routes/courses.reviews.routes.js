const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  course_review,
} = require("../controllers/courses.reviews.controller");

const {
  add_course_reviews,
  update_course_reviews,
  filter_course_reviews,
} = require("../middleware/validations/courses.reviews.validation");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.get("/:id", get_by_id);

router.post(
  "/",
  authorize(["admin", "user", "business"]),
  add_course_reviews,
  bodyParser,
  store
);

router.put(
  "/:id",
  authorize(["admin", "user", "business"]),
  update_course_reviews,
  update
);

router.delete("/:id", authorize(["admin", "user", "business"]), destroy);

router.get("/course/:courseId", filter_course_reviews, course_review);

module.exports = router;
