const express = require("express");

const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/business.course.payout.controller");

// validation
const {
  add_business_course_payout,
  update_business_course_payout,
} = require("../middleware/validations/business.course.payout.validation");

// authorization

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", index);

router.get("/:id", get_by_id);

router.post(
  "/",
  authorize(["admin"]),
  bodyParser,
  add_business_course_payout,
  store
);

router.put("/:id", authorize(["admin"]), update_business_course_payout, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
