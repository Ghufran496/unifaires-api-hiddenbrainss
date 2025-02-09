const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../../controllers/course/pricing.controller");

const {
  bodyParser,
  authorize,
} = require("../../middleware/middleware.protects");

const {
  add_pricing,
  update_pricing,
} = require("../../middleware/validations/pricing.validation");

router.get("/", authorize(["admin"]), index);

router.get("/:id", get_by_id);

router.post(
  "/",
  bodyParser,
  authorize(["business", "admin", "user"]),
  add_pricing,
  store
);

router.put(
  "/:id",
  authorize(["business", "admin", "user"]),
  update_pricing,
  update
);
router.delete("/:id", authorize(["business", "admin", "user"]), destroy);

module.exports = router;
