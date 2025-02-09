const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
  role_by_id,
  role_by_title,
  add_user_role,
  seed_store,
} = require("../controllers/roles.controller");

const {
  add_role,
  update_role,
  change_user_role,
  get_role,
} = require("../middleware/validations/role.validation");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", index);

router.post("/", bodyParser, add_role, store);

router.post("/seed", seed_store);

router.put("/:id", update_role, update);

router.delete("/:id", destroy);

router.get(
  "/title/:title",
  authorize(["admin", "user", "business"]),

  role_by_title
);

router.get("/:id", role_by_id);

router.post(
  "/change-role",

  change_user_role,
  add_user_role
);
module.exports = router;
