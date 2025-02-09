const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/subscription.plan.controller");

const {
  add_pricing,
  update_pricing,
} = require("../middleware/validations/subscription.plan.validation");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", authorize(["user", "admin", "business"]), index);

router.get("/:id", authorize(["user", "admin", "business"]), get_by_id);

router.post("/", authorize(["admin"]), bodyParser, add_pricing, store);

router.put("/:id", authorize(["admin"]), update_pricing, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
