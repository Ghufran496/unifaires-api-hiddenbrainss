const express = require("express");
const router = express();

// validatiom middlewares
const {
  add_enrolcourse,
  update_enrol_course,
} = require("../../middleware/validations/enrol.courses.validation");

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  my_course,
  my_course_categories,
  my_course_instructors,
  get_my_course_instructors,
  get_my_course_progress,
  get_course_enrol_students,
  my_course_organization_name,
} = require("../../controllers/course/enrol.courses.controller");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

const {
  filter_course,
} = require("../../middleware/validations/course.validation");

const {
  filter_instructor,
} = require("../../middleware/validations/instructor.validation");

const {
  filter_category,
} = require("../../middleware/validations/category.validation");

router.get("/", authorize(["admin", "business", "user"]), index);

router.get(
  "/students/:courseId",
  authorize(["admin", "business", "user"]),
  get_course_enrol_students
);

router.get(
  "/my-course-categories",
  authorize(["admin", "business", "user"]),
  my_course_categories
);

router.get(
  "/my-course-instructors",
  authorize(["admin", "business", "user"]),
  my_course_instructors
);

router.get(
  "/my-course-organization",
  authorize(["admin", "business", "user"]),
  my_course_organization_name
);

router.get(
  "/my-course",
  authorize(["admin", "business", "user"]),
  filter_course,
  my_course
);

router.get(
  "/my-course/instructor",
  authorize(["admin", "business", "user"]),
  filter_instructor,
  get_my_course_instructors
);

router.get(
  "/my-course/progress",
  authorize(["admin", "business", "user"]),
  get_my_course_progress
);

router.get("/:id", authorize(["admin", "user"]), get_by_id);

router.post(
  "/",
  bodyParser,
  authorize(["admin", "business", "user"]),
  add_enrolcourse,
  store
);

router.put(
  "/:id",
  authorize(["admin", "business", "user"]),
  update_enrol_course,
  update
);

router.delete("/:id", authorize(["admin", "business", "user"]), destroy);

module.exports = router;
