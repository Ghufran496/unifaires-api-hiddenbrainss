const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_workexperience,
} = require("../controllers/work.experience.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_experience,
  update_experience,
} = require("../middleware/validations/workexperience.validation");

router.get("/", authorize(["admin"]), index);
router.get(
  "/my-work-experience",
  authorize(["admin", "user", "business"]),
  user_workexperience
);

router.get("/:id", authorize(["admin", "business", "user"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "business", "user"]),
  bodyParser,
  add_experience,
  store
);

router.put(
  "/:id",
  authorize(["admin", "business", "user"]),
  update_experience,
  update
);

router.delete("/:id", authorize(["admin", "business", "user"]), destroy);

module.exports = router;
