const express = require("express");
const router = express.Router();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/access.role.permission.controller");

const {
  add_role_permission,
  update_role_permission,
} = require("../middleware/validations/access.role.permission.validation");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin", "user", "business"]), index);

router.post("/", bodyParser, authorize(["admin"]), add_role_permission, store);

router.put("/:id", authorize(["admin"]), update_role_permission, update);

router.delete("/:id", authorize(["admin"]), destroy);

router.get("/:id", authorize(["admin", "user", "business"]), get_by_id);

module.exports = router;
