const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_wish,
} = require("../controllers/course.wish.controller");

const {
  add_course_wish,
  update_course_wish,
} = require("../middleware/validations/course.wish.validation");

const {
  filter_course,
} = require("../middleware/validations/course.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), filter_course, index);

router.post(
  "/",
  authorize(["admin", "user"]),
  bodyParser,
  add_course_wish,
  store
);

router.put("/:id", authorize(["admin", "user"]), update_course_wish, update);

router.delete("/:id", authorize(["admin", "user"]), destroy);

router.get("/user", authorize(["admin", "user"]), filter_course, user_wish);

router.get("/:id", authorize(["admin", "user"]), get_by_id);

module.exports = router;
