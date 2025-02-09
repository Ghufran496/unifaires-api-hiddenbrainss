const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  get_all_business_voucher,
} = require("../controllers/voucher.controller");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

const { add_voucher } = require("../middleware/validations/voucher.validation");

router.get("/", authorize(["admin"]), index);

router.post(
  "/",
  bodyParser,
  authorize(["admin", "business"]),
  add_voucher,
  store
);

router.put("/", authorize(["admin", "business"]), update);

router.delete("/:id", authorize(["admin", "business"]), destroy);

router.get(
  "/get_business_vouchers",
  authorize(["admin", "business"]),
  get_all_business_voucher
);

router.get("/:id", authorize(["admin", "business"]), get_by_id);

module.exports = router;
