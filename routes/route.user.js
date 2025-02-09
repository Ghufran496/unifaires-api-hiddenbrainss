const express = require("express");
const router = express.Router();

const {
  add_user,
  update_user,
} = require("../middleware/validations/user.validation");
const {
  index,
  store,
  update,
  destroy,
} = require("../controllers/users.controller");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.post("/", bodyParser, add_user, store);

router.put(
  "/:id",
  authorize(["user", "admin", "business"]),
  update_user,
  update
);

router.delete("/:id", authorize(["admin"]), destroy);

module.exports = router;
