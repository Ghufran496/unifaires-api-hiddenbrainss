const express = require("express");

const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/invite.pricings.controller");

// validation
const {
  add_pricing,
  update_pricing,
} = require("../middleware/validations/invite.pricing.validation");

// authorization

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", index);

router.get("/:id", get_by_id);

router.post("/", authorize(["admin"]), bodyParser, add_pricing, store);

router.put("/:id", authorize(["admin"]), update_pricing, update);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
