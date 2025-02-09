const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_enrol_funding,
  business_funding_enrol,
  user_funding_enrol,
  update_status,
} = require("../controllers/funding.enrol.controller");

const {
  add_enrol,
  update_enrol,
  filter_enrol,
} = require("../middleware/validations/funding.enrol.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), filter_enrol, index);

router.get(
  "/user-enrol",
  authorize(["admin", "user"]),
  filter_enrol,
  user_enrol_funding
);

router.get(
  "/business-funding-enrol",
  authorize(["business"]),
  filter_enrol,
  business_funding_enrol
);

router.get("/user-funding", authorize(["admin", "user"]), user_funding_enrol);

router.get("/:id", authorize(["admin", "business", "user"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "user", "business"]),
  bodyParser,
  add_enrol,
  store
);

router.put(
  "/status/:id",
  authorize(["admin", "business"]),
  update_enrol,
  update_status
);

router.put(
  "/:id",
  authorize(["admin", "user", "business"]),
  update_enrol,
  update
);

router.delete("/user/:id", authorize(["user"]), destroy);

router.delete("/:id", authorize(["user", "admin", "business"]), destroy);

module.exports = router;
