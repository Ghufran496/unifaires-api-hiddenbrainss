const express = require("express");
const router = express();

const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  associate_users,
} = require("../controllers/associate.user.controller");

const {
  add_user,
  update_user,
} = require("../middleware/validations/associate.user.validation");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin", "business"]), index);

router.get("/users", authorize(["admin", "business"]), associate_users);

router.get("/:id", authorize(["admin", "business"]), get_by_id);

router.post("/", authorize(["admin", "business"]), bodyParser, add_user, store);

router.put("/:id", authorize(["admin", "business"]), update_user, update);

router.delete("/:id", authorize(["admin", "business"]), destroy);

module.exports = router;
