const express = require("express");
const router = express();
const {
  index,
  store,
  update,
  destroy,
  get_by_id,
  user_education,
} = require("../controllers/education.controller");

const { authorize, bodyParser } = require("../middleware/middleware.protects");

const {
  add_education,
  update_education,
} = require("../middleware/validations/education.validation");

router.get("/", authorize(["admin"]), index);
router.get(
  "/my-education",
  authorize(["admin", "user", "business"]),
  user_education
);

router.get("/:id", authorize(["admin", "business", "user"]), get_by_id);

router.post(
  "/",
  authorize(["admin", "business", "user"]),
  bodyParser,
  add_education,
  store
);

router.put(
  "/:id",
  authorize(["admin", "business", "user"]),
  update_education,
  update
);

router.delete("/:id", authorize(["admin", "business", "user"]), destroy);

module.exports = router;
