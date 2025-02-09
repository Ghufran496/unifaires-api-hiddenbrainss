const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_license,
} = require("../controllers/driving.lincense.controller");

const {
  add_license,
  update_license,
} = require("../middleware/validations/driving.license.validation");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", index);

router.get("/user", authorize(["user", "admin", "business"]), user_license);

router.post(
  "/",
  bodyParser,
  authorize(["admin", "user", "business"]),
  add_license,
  store
);

router.put(
  "/:id",
  authorize(["admin", "user", "business"]),
  update_license,
  update
);

router.delete("/:id", authorize(["admin", "user", "business"]), destroy);

router.get("/:id", authorize(["admin", "user", "business"]), get_by_id);

module.exports = router;
