const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
  role_by_id,
  role_by_title,
  business_role,
  user_role,
} = require("../controllers/access.role.controller");

const {
  add_role,
  update_role,
} = require("../middleware/validations/access.roles.validation");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.get("/user-roles", authorize(["admin", "user"]), user_role);

router.get("/business-roles", authorize(["admin", "business"]), business_role);

router.post("/", authorize(["admin"]), bodyParser, add_role, store);

router.put("/:id", authorize(["admin"]), update_role, update);

router.delete("/:id", authorize(["admin"]), destroy);

router.get(
  "/title/:title",
  authorize(["admin", "user", "business"]),

  role_by_title
);

router.get("/:id", authorize(["admin", "user", "business"]), role_by_id);

module.exports = router;
