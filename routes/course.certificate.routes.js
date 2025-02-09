const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  get_course_certificate,
} = require("../controllers/course.certificate.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");
const {
  add_certificate,
  update_certificate,
} = require("../middleware/validations/course.certificate.validation");

router.get("/", authorize(["user", "admin", "business"]), index);

router.get(
  "/course/:id",
  authorize(["user", "admin", "business"]),
  get_course_certificate
);

router.get("/:id", authorize(["user", "admin", "business"]), get_by_id);

router.post(
  "/",
  authorize(["user", "admin", "business"]),
  bodyParser,
  add_certificate,
  store
);

router.put(
  "/:id",
  authorize(["user", "admin", "business"]),
  update_certificate,
  update
);

router.delete("/:id", authorize(["user", "admin", "business"]), destroy);

module.exports = router;
