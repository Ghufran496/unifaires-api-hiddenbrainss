const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/team.members.controller");

const {
  add_teammembers,
  update_teammembers,
} = require("../middleware/validations/team.members.validation");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.post("/", bodyParser, authorize(["admin"]), add_teammembers, store);

router.put("/:id", authorize(["admin"]), update_teammembers, update);

router.delete("/:id", authorize(["admin"]), destroy);

router.get("/:id", get_by_id);

module.exports = router;
