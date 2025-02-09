const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  get_course_assignment,
} = require("../../controllers/course/assignment.controller");

const {
  add_assignment,
  update_assignment,
} = require("../../middleware/validations/assignment.validation");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.get(
  "/course/:courseId",
  authorize(["admin", "business", "user"]),
  get_course_assignment
);

router.get("/:id", authorize(["admin", "business", "user"]), get_by_id);

router.post(
  "/",
  bodyParser,
  authorize(["admin", "business"]),
  add_assignment,
  store
);
router.put("/:id", authorize(["admin", "business"]), update_assignment, update);

router.delete("/:id", authorize(["admin", "business"]), destroy);

module.exports = router;
