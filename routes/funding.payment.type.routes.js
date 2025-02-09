const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/funding.payment.type.controller");

const {
  add_funding_payment_type,
  update_funding_payment_type,
} = require("../middleware/validations/funding.payment.type.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin", "business", "user"]), index);

router.get("/:id", authorize(["business", "admin", "user"]), get_by_id);

router.post(
  "/",
  authorize(["admin"]),
  bodyParser,
  add_funding_payment_type,
  store
);

router.put("/:id", authorize(["admin"]), update_funding_payment_type, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
