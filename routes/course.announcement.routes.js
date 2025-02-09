const { authorize, bodyParser } = require("../middleware/middleware.protects");

const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  get_course_announcements,
} = require("../controllers/course.announcement.controller");
const {
  add_course_announcement,
  update_course_announcement,
} = require("../middleware/validations/course.announcement.validation");

router.get("/", authorize(["admin"]), index);

router.get(
  "/course/:courseId",
  authorize(["admin", "user", "business"]),
  get_course_announcements
);
router.get("/:id", authorize(["admin", "user", "business"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "user", "business"]),
  bodyParser,
  add_course_announcement,
  store
);

router.put(
  "/:id",
  authorize(["admin", "user", "business"]),
  bodyParser,
  update_course_announcement,
  update
);

router.delete("/:id", authorize(["admin", "user", "business"]), destroy);

module.exports = router;
