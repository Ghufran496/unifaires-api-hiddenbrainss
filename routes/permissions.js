const express = require("express");
const router = express.Router();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/permissions.controller");

const {
  add_permission,
  update_permission,
} = require("../middleware/validations/permission.validation");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.post("/", bodyParser, authorize(["admin"]), add_permission, store);

router.put("/:id", authorize(["admin"]), update_permission, update);

router.delete("/:id", authorize(["admin"]), destroy);

router.get("/:id", authorize(["admin"]), get_by_id);

module.exports = router;
