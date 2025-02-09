const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  get_by_course_id,
} = require("../../controllers/course/section.controller");

const {
  add_section,
  update_section,
} = require("../../middleware/validations/section.validation");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

router.get("/", authorize(["business", "admin"]), index);

router.get("/:id", get_by_id);
router.post(
  "/",
  bodyParser,
  authorize(["business", "admin", "user"]),
  add_section,
  store
);

router.put(
  "/:id",
  authorize(["business", "admin", "user"]),
  update_section,
  update
);

router.delete("/:id", authorize(["business", "admin"]), destroy);

router.get(
  "/course/:courseId",
  authorize(["business", "users", "admin"]),
  get_by_course_id
);

// lectures routes
module.exports = router;
