const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/jobs.payment.type.controller");

const {
  add_jobspayment_type,
  update_jobspayment_type,
} = require("../middleware/validations/jobs.payment.type.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin", "business", "user"]), index);

router.get("/:id", authorize(["business", "admin", "user"]), get_by_id);

router.post(
  "/",
  authorize(["business", "admin", "user"]),
  bodyParser,
  add_jobspayment_type,
  store
);

router.put("/:id", authorize(["admin"]), update_jobspayment_type, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
