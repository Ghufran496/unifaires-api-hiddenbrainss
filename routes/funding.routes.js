const express = require("express");
const router = express();
const {
  index,
  store,
  destroy,
  get_by_id,
  business_update,
  admin_update,
  admin_funding,
  business_funding,
  admin_funding_applicants,
  business_funding_applicants,
  get_by_slug,
  admin,
  funding_attributes_filter,
} = require("../controllers/funding.controller");

const {
  add_funding,
  update_funding,
  filter_funding,
} = require("../middleware/validations/funding.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");
const {
  filter_enrol,
} = require("../middleware/validations/funding.enrol.validation");

router.get("/", filter_funding, index);

router.get("/all", filter_funding, admin);

router.get(
  "/user-funding-applicants/:fundingId",
  authorize(["admin"]),
  filter_enrol,
  admin_funding_applicants
);

router.get(
  "/business-funding-applicants/:fundingId",
  authorize(["business"]),
  filter_enrol,
  business_funding_applicants
);

router.get("/user", authorize(["admin"]), filter_funding, admin_funding);

router.get(
  "/business",
  authorize(["business"]),
  filter_funding,
  business_funding
);

router.post(
  "/",
  authorize(["admin", "business"]),
  bodyParser,
  add_funding,

  store
);

router.put(
  "/business/:id",
  authorize(["business"]),
  update_funding,
  business_update
);

router.put(
  "/user/:id",
  authorize(["admin", "business"]),
  update_funding,
  admin_update
);

router.delete("/:id", authorize(["admin", "business"]), destroy);

router.get("/slug/:slug", get_by_slug);
router.get("/filter-attributes", funding_attributes_filter);

router.get("/:id", get_by_id);

module.exports = router;
