const express = require("express");

const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/funding.business.pricing.controller");

// validation
const {
  add_funding_business_pricings,
  update_funding_business_pricings,
} = require("../middleware/validations/funding.business.pricing.validation");

// authorization

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", index);

router.get("/:id", get_by_id);

router.post(
  "/",
  authorize(["admin"]),
  bodyParser,
  add_funding_business_pricings,
  store
);

router.put(
  "/:id",
  authorize(["admin"]),
  update_funding_business_pricings,
  update
);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
