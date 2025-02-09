const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  get_help_by_status,
  users_helps,
} = require("../controllers/help.controller");

const {
  add_help,
  update_help,
  help_by_status,
} = require("../middleware/validations/help.validation");

const {
  bodyParser,
  authorize,
  nonStrictlyAuthorize,
} = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.get(
  "/my-helps/:email",
  nonStrictlyAuthorize(["user", "business", "admin"]),
  users_helps
);

router.post(
  "/",
  bodyParser,
  nonStrictlyAuthorize(["user", "business", "admin"]),
  add_help,
  store
);

router.put("/:id", update_help, update);

router.delete("/:id", authorize(["business", "admin", "user"]), destroy);

router.get("/status", help_by_status, get_help_by_status);

router.get("/:id", authorize(["business", "admin", "user"]), get_by_id);

module.exports = router;
