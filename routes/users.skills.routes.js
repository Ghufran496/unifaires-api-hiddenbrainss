const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_skills,
} = require("../controllers/users.skills.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_user_skill,
  update_user_skills,
} = require("../middleware/validations/users.skills.validation");
const {
  validate_bulk_skills,
} = require("../middleware/validations/skills.validation");

router.get("/", authorize(["admin"]), index);

router.get("/my-skills", authorize(["admin", "user"]), user_skills);

router.get("/:id", authorize(["admin", , "user"]), get_by_id);

router.post(
  "/",
  authorize(["admin", , "user"]),
  bodyParser,
  add_user_skill,
  validate_bulk_skills,
  store
);

router.put("/:id", authorize(["admin", , "user"]), update_user_skills, update);

router.delete("/:id", authorize(["admin", , "user"]), destroy);

module.exports = router;
