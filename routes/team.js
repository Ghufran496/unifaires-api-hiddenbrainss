const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
} = require("../controllers/team.controller");

const {
  add_team,
  update_team,
} = require("../middleware/validations/team.validation");

const { bodyParser, authorize } = require("../middleware/middleware.protects");

router.get("/", authorize(["admin"]), index);

router.post("/", bodyParser, authorize(["admin"]), add_team, store);

router.put("/:id", authorize(["admin"]), update_team, update);

router.delete("/:id", authorize(["admin"]), destroy);

router.get("/:id", get_by_id);

module.exports = router;
