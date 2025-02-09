const express = require("express");
const router = express.Router();
const {
  update_business,
  add_business,
  update_business_username_validation,
} = require("../middleware/validations/business.validation");

const {
  index,
  store,
  get_by_id,
  update,
  destroy,
  my_profile,
  stats,
  update_business_username,
  business_profile,
} = require("../controllers/business.controller");

const { bodyParser, authorize } = require("../middleware/middleware.protects");
const { businessRegister } = require("./../controllers/controller.auth");

router.get("/", index);

router.get("/profile/:username", business_profile);

router.put(
  "/profile/username",
  authorize(["business"]),
  update_business_username_validation,
  update_business_username
);

router.get("/stats", authorize(["business"]), stats);

router.post("/", bodyParser, add_business, businessRegister);

router.put("/:id", authorize(["admin", "business"]), update_business, update);

router.delete("/:id", authorize(["admin", "business"]), destroy);

router.get("/my-profile", authorize(["business"]), my_profile);

router.get("/:id", authorize(["admin", "business"]), get_by_id);

module.exports = router;
