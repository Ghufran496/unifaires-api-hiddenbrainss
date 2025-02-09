const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_archieve,
  enrol_store,
  enrol_destroy,
} = require("../controllers/course.archieve.controller");

const {
  add_archieve,
  update_archieve,
} = require("../middleware/validations/course.archieve.validation");

const {
  filter_course,
} = require("../middleware/validations/course.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), filter_course, index);

router.post(
  "/",
  authorize(["admin", "business", "user"]),
  bodyParser,
  add_archieve,
  store
);

router.post(
  "/user",
  authorize(["user", "admin"]),
  bodyParser,
  add_archieve,
  enrol_store
);

router.put(
  "/:id",
  authorize(["admin", "business", "user"]),
  update_archieve,
  update
);

router.delete("/user/:id", authorize(["user", "admin"]), enrol_destroy);

router.delete("/:id", authorize(["admin", "business", "user"]), destroy);

router.get(
  "/user",
  authorize(["admin", "business", "user"]),
  filter_course,
  user_archieve
);

router.get("/:id", authorize(["admin", "business", "user"]), get_by_id);

module.exports = router;
