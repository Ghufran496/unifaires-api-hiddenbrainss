const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/course.payment.type.controller");

const {
  add_course_payment_type,
  update_course_payment_type,
} = require("../middleware/validations/course.payment.type.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin", "business", "user"]), index);

router.get("/:id", authorize(["business", "admin", "user"]), get_by_id);

router.post(
  "/",
  authorize(["business", "admin"]),
  bodyParser,
  add_course_payment_type,
  store
);

router.put(
  "/:id",
  authorize(["business", "admin"]),
  update_course_payment_type,
  update
);

router.delete("/:id", authorize(["business", "admin"]), destroy);

module.exports = router;
