const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/coupon.controller");

const {
  add_coupons,
  update_coupons,
} = require("../middleware/validations/coupon.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.get("/:id", authorize(["admin", "user", "business"]), get_by_id);

router.post("/", authorize(["admin"]), bodyParser, add_coupons, store);

router.put("/:id", authorize(["admin"]), update_coupons, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
